"""Export Telegram group/chat messages to JSON. Works locally and in CI."""

from __future__ import annotations

import asyncio
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.functions.messages import GetForumTopicsRequest
from telethon.helpers import add_surrogate, del_surrogate
from telethon.tl.types import (
    ForumTopic,
    Message,
    MessageActionTopicCreate,
    MessageEntityBold,
    MessageEntityBotCommand,
    MessageEntityCashtag,
    MessageEntityCode,
    MessageEntityEmail,
    MessageEntityHashtag,
    MessageEntityItalic,
    MessageEntityMention,
    MessageEntityMentionName,
    MessageEntityPhone,
    MessageEntityPre,
    MessageEntityStrike,
    MessageEntityTextUrl,
    MessageEntityUnderline,
    MessageEntityUrl,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")

GLOBAL_STAGE_COUNT = 5
GROUP_STAGE_COUNT = 6


class StageLogger:
    def __init__(self, total: int, *, prefix: str = "") -> None:
        self.total = total
        self.step = 0
        self.prefix = f"{prefix} " if prefix else ""

    def advance(self, title: str, detail: str | None = None) -> None:
        self.step += 1
        line = f"{self.prefix}[{self.step}/{self.total}] {title}"
        if detail:
            line += f" — {detail}"
        print(line, flush=True)

    def note(self, message: str) -> None:
        print(f"{self.prefix}  {message}", flush=True)


def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        print(f"Missing required environment variable: {name}", file=sys.stderr)
        sys.exit(1)
    return value


GENERAL_TOPIC_ID = 1
FORUM_REPAIR_WINDOW = 2000
REPAIR_BATCH_SIZE = 100

ENTITY_TYPE_BY_CLASS: dict[type, str] = {
    MessageEntityBold: "bold",
    MessageEntityItalic: "italic",
    MessageEntityUnderline: "underline",
    MessageEntityStrike: "strikethrough",
    MessageEntityCode: "code",
    MessageEntityPre: "pre",
    MessageEntityTextUrl: "text_link",
    MessageEntityUrl: "link",
    MessageEntityMention: "mention",
    MessageEntityMentionName: "mention_name",
    MessageEntityHashtag: "hashtag",
    MessageEntityCashtag: "cashtag",
    MessageEntityBotCommand: "bot_command",
    MessageEntityEmail: "email",
    MessageEntityPhone: "phone",
}


def map_entity_type(entity) -> str:
    for cls, name in ENTITY_TYPE_BY_CLASS.items():
        if isinstance(entity, cls):
            return name
    return "plain"


def serialize_entities(message: Message) -> list[dict]:
    text = message.message or ""
    entities = message.entities or []

    if not text:
        return []

    if not entities:
        return [{"type": "plain", "text": text}]

    surrogate_text = add_surrogate(text)
    segments: list[dict] = []
    last_end = 0

    for entity in sorted(entities, key=lambda item: item.offset):
        start = entity.offset
        end = entity.offset + entity.length

        if start > last_end:
            plain_text = del_surrogate(surrogate_text[last_end:start])
            if plain_text:
                segments.append({"type": "plain", "text": plain_text})

        segment_text = del_surrogate(surrogate_text[start:end])
        if not segment_text:
            last_end = max(last_end, end)
            continue

        segment: dict = {
            "type": map_entity_type(entity),
            "text": segment_text,
        }

        if isinstance(entity, MessageEntityTextUrl):
            segment["href"] = entity.url
        elif isinstance(entity, MessageEntityMentionName):
            segment["user_id"] = entity.user_id
        elif isinstance(entity, MessageEntityPre) and entity.language:
            segment["language"] = entity.language

        segments.append(segment)
        last_end = end

    if last_end < len(surrogate_text):
        tail = del_surrogate(surrogate_text[last_end:])
        if tail:
            segments.append({"type": "plain", "text": tail})

    return segments


async def get_sender_name(message: Message) -> str | None:
    if message.post_author:
        return message.post_author

    try:
        sender = await message.get_sender()
    except Exception:
        return None

    if sender is None:
        return None

    title = getattr(sender, "title", None)
    if title:
        return title

    parts = [
        part
        for part in (
            getattr(sender, "first_name", None),
            getattr(sender, "last_name", None),
        )
        if part
    ]
    full_name = " ".join(parts).strip()
    if full_name:
        return full_name

    username = getattr(sender, "username", None)
    return f"@{username}" if username else None


def get_topic_id(message: Message, is_forum: bool) -> int | None:
    if not is_forum:
        return None

    reply_to = message.reply_to
    if reply_to is not None:
        top_id = getattr(reply_to, "reply_to_top_id", None)
        if top_id:
            return top_id

        if getattr(reply_to, "forum_topic", False):
            reply_msg_id = getattr(reply_to, "reply_to_msg_id", None)
            if reply_msg_id:
                return reply_msg_id

    if message.action and isinstance(message.action, MessageActionTopicCreate):
        return message.id

    return GENERAL_TOPIC_ID


async def message_to_dict(message: Message, is_forum: bool) -> dict:
    media_type = None
    if message.media:
        media_type = type(message.media).__name__

    return {
        "id": message.id,
        "date": message.date.isoformat() if message.date else None,
        "sender_id": message.sender_id,
        "sender_name": await get_sender_name(message),
        "text": message.message or "",
        "entities": serialize_entities(message),
        "reply_to": message.reply_to_msg_id,
        "topic_id": get_topic_id(message, is_forum),
        "has_media": bool(message.media),
        "media_type": media_type,
    }


def load_json(path: Path, default):
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def merge_messages(existing: list[dict], fetched: list[dict]) -> list[dict]:
    by_id = {item["id"]: item for item in existing}
    for item in fetched:
        by_id[item["id"]] = item
    return [by_id[key] for key in sorted(by_id)]


def merge_topics(existing: list[dict], fetched: list[dict]) -> list[dict]:
    by_id = {item["id"]: item for item in existing}
    for item in fetched:
        by_id[item["id"]] = item
    return [by_id[key] for key in sorted(by_id)]


async def fetch_messages_by_ids(
    client: TelegramClient,
    chat: str,
    message_ids: list[int],
    is_forum: bool,
) -> list[dict]:
    fetched: list[dict] = []

    for index in range(0, len(message_ids), REPAIR_BATCH_SIZE):
        batch = message_ids[index : index + REPAIR_BATCH_SIZE]
        messages = await client.get_messages(chat, ids=batch)

        if messages is None:
            continue

        if not isinstance(messages, list):
            messages = [messages]

        for message in messages:
            if isinstance(message, Message):
                fetched.append(await message_to_dict(message, is_forum))

    return fetched


async def repair_forum_messages(
    client: TelegramClient,
    chat: str,
    merged: list[dict],
    is_forum: bool,
) -> list[dict]:
    if not is_forum or not merged:
        return merged

    max_id = max(item["id"] for item in merged)
    min_id = max(1, max_id - FORUM_REPAIR_WINDOW + 1)
    repair_ids = list(range(min_id, max_id + 1))
    repaired = await fetch_messages_by_ids(client, chat, repair_ids, is_forum)

    if not repaired:
        return merged

    return merge_messages(merged, repaired)


async def fetch_forum_topics(client: TelegramClient, entity) -> list[dict]:
    if not getattr(entity, "forum", False):
        return []

    topics: list[dict] = []
    offset_topic = 0

    while True:
        result = await client(
            GetForumTopicsRequest(
                peer=entity,
                q="",
                offset_date=None,
                offset_id=0,
                offset_topic=offset_topic,
                limit=100,
            )
        )

        if not result.topics:
            break

        for topic in result.topics:
            if isinstance(topic, ForumTopic):
                topics.append({"id": topic.id, "title": topic.title})

        offset_topic = result.topics[-1].id

        if len(result.topics) < 100:
            break

    return topics


def chat_to_slug(chat: str) -> str:
    normalized = chat.strip()
    if normalized.startswith("@"):
        return normalized[1:]
    if normalized.startswith("https://t.me/"):
        normalized = normalized.removeprefix("https://t.me/")
    return re.sub(r"[^a-zA-Z0-9_-]+", "_", normalized)


def load_groups() -> list[dict]:
    groups_path = ROOT_DIR / "data" / "groups.json"
    if groups_path.exists():
        manifest = load_json(groups_path, {"groups": []})
        groups = manifest.get("groups", [])
        if groups:
            return groups

    chat = os.environ.get("TELEGRAM_CHAT", "").strip()
    if chat:
        return [{"slug": chat_to_slug(chat), "chat": chat}]

    print(
        "No groups configured. Add data/groups.json or set TELEGRAM_CHAT.",
        file=sys.stderr,
    )
    sys.exit(1)


def describe_export_mode(
    last_message_id: int,
    needs_topic_backfill: bool,
    needs_metadata_backfill: bool,
) -> str:
    if needs_topic_backfill and needs_metadata_backfill:
        return "full rescan (topic and metadata backfill)"
    if needs_topic_backfill:
        return "full rescan (topic backfill)"
    if needs_metadata_backfill:
        return "full rescan (metadata backfill)"
    if last_message_id:
        return f"incremental (messages after id {last_message_id})"
    return "full history (first export)"


async def export_group(
    client: TelegramClient,
    slug: str,
    chat: str,
    *,
    group_index: int,
    group_total: int,
) -> None:
    group_prefix = f"Group {group_index}/{group_total} [{slug}]"
    stages = StageLogger(GROUP_STAGE_COUNT, prefix=group_prefix)

    output_dir = ROOT_DIR / "data" / "groups" / slug
    output_path = output_dir / "messages.json"
    topics_path = output_dir / "topics.json"
    state_path = output_dir / "export_state.json"

    stages.advance(
        "Load local export data",
        f"reading {output_dir.relative_to(ROOT_DIR)}",
    )
    existing_messages = load_json(output_path, [])
    existing_topics = load_json(topics_path, [])
    state = load_json(state_path, {})
    last_message_id = int(state.get("last_message_id", 0))
    stages.note(
        f"on disk: {len(existing_messages)} message(s), "
        f"{len(existing_topics)} topic(s), last_message_id={last_message_id}"
    )

    stages.advance("Resolve Telegram chat", chat)
    entity = await client.get_entity(chat)
    entity_title = getattr(entity, "title", None) or getattr(entity, "username", chat)
    is_forum = bool(getattr(entity, "forum", False))
    stages.note(
        f"resolved as «{entity_title}»"
        + (" (forum)" if is_forum else " (regular chat)")
    )

    needs_topic_backfill = is_forum and any(
        item.get("topic_id") is None for item in existing_messages
    )
    needs_metadata_backfill = any(
        "entities" not in item or "sender_name" not in item
        for item in existing_messages
    )
    export_mode = describe_export_mode(
        last_message_id,
        needs_topic_backfill,
        needs_metadata_backfill,
    )

    stages.advance("Fetch messages from Telegram", export_mode)
    fetched: list[dict] = []
    if last_message_id and not needs_topic_backfill and not needs_metadata_backfill:
        async for message in client.iter_messages(chat, min_id=last_message_id):
            if isinstance(message, Message):
                fetched.append(await message_to_dict(message, is_forum))
    else:
        async for message in client.iter_messages(chat):
            if isinstance(message, Message):
                fetched.append(await message_to_dict(message, is_forum))
    stages.note(f"fetched {len(fetched)} message(s) from API")

    if is_forum:
        stages.advance("Fetch forum topics", "loading topic list")
        fetched_topics = await fetch_forum_topics(client, entity)
        stages.note(f"fetched {len(fetched_topics)} topic(s) from API")
    else:
        stages.advance("Fetch forum topics", "skipped (not a forum)")
        fetched_topics = []

    stages.advance("Merge local data with fetched data")
    merged = merge_messages(existing_messages, fetched)
    if is_forum and merged:
        before_repair = len(merged)
        merged = await repair_forum_messages(client, chat, merged, is_forum)
        repaired_count = len(merged) - before_repair
        if repaired_count:
            stages.note(
                f"forum repair window: added {repaired_count} missing message(s)"
            )
        else:
            stages.note(
                f"forum repair window: refreshed up to {FORUM_REPAIR_WINDOW} recent id(s)"
            )
    merged_topics = merge_topics(existing_topics, fetched_topics)
    max_id = max((item["id"] for item in merged), default=last_message_id)
    stages.note(
        f"merged totals: {len(merged)} message(s), "
        f"{len(merged_topics)} topic(s), max message id={max_id}"
    )

    stages.advance(
        "Save JSON files",
        "messages.json, topics.json, export_state.json, icon",
    )
    output_dir.mkdir(parents=True, exist_ok=True)
    save_json(output_path, merged)
    save_json(topics_path, merged_topics)
    save_json(
        state_path,
        {
            "chat": chat,
            "title": entity_title,
            "last_message_id": max_id,
            "message_count": len(merged),
            "topic_count": len(merged_topics),
            "is_forum": is_forum,
            "exported_at": datetime.now(timezone.utc).isoformat(),
        },
    )
    icon_path = output_dir / "icon.jpg"
    icon_file = await client.download_profile_photo(entity, file=str(icon_path))
    if icon_file:
        stages.note(f"saved {icon_path.name}")
    elif icon_path.exists():
        icon_path.unlink()
        stages.note("removed stale group icon (no profile photo)")
    else:
        stages.note("no group profile photo")
    stages.note(f"written to {output_dir.relative_to(ROOT_DIR)}")
    stages.note(
        f"done: +{len(fetched)} new message(s), {len(merged)} total in archive"
    )


async def export_messages() -> None:
    stages = StageLogger(GLOBAL_STAGE_COUNT)
    print(f"Telegram export started ({GLOBAL_STAGE_COUNT} stages)", flush=True)

    stages.advance("Validate environment", "TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_SESSION")
    api_id = int(require_env("TELEGRAM_API_ID"))
    api_hash = require_env("TELEGRAM_API_HASH")
    session = require_env("TELEGRAM_SESSION")
    stages.note("required variables are present")

    stages.advance("Load groups configuration", "data/groups.json or TELEGRAM_CHAT")
    groups = load_groups()
    stages.note(f"found {len(groups)} group(s) to export")

    stages.advance("Connect to Telegram API")
    client = TelegramClient(StringSession(session), api_id, api_hash)
    await client.start()
    me = await client.get_me()
    display_name = getattr(me, "username", None) or getattr(me, "first_name", "account")
    stages.note(f"connected as @{display_name}" if getattr(me, "username", None) else f"connected as {display_name}")

    stages.advance(
        "Export groups",
        f"{len(groups)} group(s), {GROUP_STAGE_COUNT} sub-stages each",
    )
    for index, group in enumerate(groups, start=1):
        slug = group.get("slug") or chat_to_slug(group["chat"])
        chat = group["chat"]
        print(flush=True)
        await export_group(
            client,
            slug,
            chat,
            group_index=index,
            group_total=len(groups),
        )

    stages.advance("Disconnect from Telegram")
    await client.disconnect()
    stages.note("session closed")

    print(flush=True)
    print(
        f"Telegram export finished: {len(groups)} group(s) processed.",
        flush=True,
    )


def main() -> None:
    asyncio.run(export_messages())


if __name__ == "__main__":
    main()
