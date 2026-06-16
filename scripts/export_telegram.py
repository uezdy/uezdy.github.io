"""Export Telegram group/chat messages to JSON. Works locally and in CI."""

from __future__ import annotations

import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.functions.messages import GetForumTopicsRequest
from telethon.tl.types import (
    ForumTopic,
    Message,
    MessageActionTopicCreate,
)

ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")


def require_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        print(f"Missing required environment variable: {name}", file=sys.stderr)
        sys.exit(1)
    return value


GENERAL_TOPIC_ID = 1


def get_topic_id(message: Message, is_forum: bool) -> int | None:
    if not is_forum:
        return None

    if message.reply_to is not None and getattr(message.reply_to, "forum_topic", False):
        top_id = getattr(message.reply_to, "reply_to_top_id", None)
        if top_id:
            return top_id

    if message.action and isinstance(message.action, MessageActionTopicCreate):
        return message.id

    return GENERAL_TOPIC_ID


def message_to_dict(message: Message, is_forum: bool) -> dict:
    media_type = None
    if message.media:
        media_type = type(message.media).__name__

    return {
        "id": message.id,
        "date": message.date.isoformat() if message.date else None,
        "sender_id": message.sender_id,
        "text": message.message or "",
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


async def export_messages() -> None:
    api_id = int(require_env("TELEGRAM_API_ID"))
    api_hash = require_env("TELEGRAM_API_HASH")
    session = require_env("TELEGRAM_SESSION")
    chat = require_env("TELEGRAM_CHAT")

    output_path = Path(os.environ.get("OUTPUT_PATH", "data/messages.json"))
    topics_path = Path(os.environ.get("TOPICS_PATH", "data/topics.json"))
    state_path = Path(os.environ.get("STATE_PATH", "data/export_state.json"))

    existing_messages = load_json(output_path, [])
    existing_topics = load_json(topics_path, [])
    state = load_json(state_path, {})
    last_message_id = int(state.get("last_message_id", 0))

    client = TelegramClient(StringSession(session), api_id, api_hash)
    await client.start()

    entity = await client.get_entity(chat)
    is_forum = bool(getattr(entity, "forum", False))
    needs_topic_backfill = is_forum and any(
        item.get("topic_id") is None for item in existing_messages
    )

    fetched: list[dict] = []
    if last_message_id and not needs_topic_backfill:
        async for message in client.iter_messages(chat, min_id=last_message_id):
            if isinstance(message, Message):
                fetched.append(message_to_dict(message, is_forum))
    else:
        async for message in client.iter_messages(chat):
            if isinstance(message, Message):
                fetched.append(message_to_dict(message, is_forum))

    fetched_topics = await fetch_forum_topics(client, entity)

    await client.disconnect()

    merged = merge_messages(existing_messages, fetched)
    merged_topics = merge_topics(existing_topics, fetched_topics)
    max_id = max((item["id"] for item in merged), default=last_message_id)

    save_json(output_path, merged)
    save_json(topics_path, merged_topics)
    save_json(
        state_path,
        {
            "chat": chat,
            "last_message_id": max_id,
            "message_count": len(merged),
            "topic_count": len(merged_topics),
            "is_forum": is_forum,
            "exported_at": datetime.now(timezone.utc).isoformat(),
        },
    )

    print(
        f"Exported {len(fetched)} new message(s); "
        f"total {len(merged)} -> {output_path}"
    )


def main() -> None:
    asyncio.run(export_messages())


if __name__ == "__main__":
    main()
