import { getMessagePlainText } from '@/lib/messageText';
import { GENERAL_TOPIC_ID } from '@/lib/topicConstants';
import { resolveMessageTopicId as resolveTopicId } from '@/lib/topics';
import type { TelegramMessage } from '@/types/telegram';

export function hasDisplayText(message: TelegramMessage): boolean {
  return getMessagePlainText(message).trim().length > 0;
}

export function resolveMessageTopicId(
  message: TelegramMessage,
  groupSlug?: string,
  allMessages?: TelegramMessage[]
): number {
  const rawTopicId = message.topic_id ?? GENERAL_TOPIC_ID;

  if (!groupSlug || !allMessages) {
    return rawTopicId;
  }

  return resolveTopicId(message, groupSlug, allMessages);
}

export function filterMessagesByTopic(
  messages: TelegramMessage[],
  topicId: number,
  groupSlug?: string
): TelegramMessage[] {
  return messages.filter(
    (message) => resolveMessageTopicId(message, groupSlug, messages) === topicId
  );
}

const displayableCache = new WeakMap<
  TelegramMessage[],
  Map<string, TelegramMessage[]>
>();

function computeDisplayableMessages(
  messages: TelegramMessage[],
  topicId?: number,
  groupSlug?: string
): TelegramMessage[] {
  const scoped =
    topicId === undefined
      ? messages
      : filterMessagesByTopic(messages, topicId, groupSlug);

  return scoped.filter(hasDisplayText);
}

export function getDisplayableMessages(
  messages: TelegramMessage[],
  topicId?: number,
  groupSlug?: string
): TelegramMessage[] {
  let byTopic = displayableCache.get(messages);

  if (!byTopic) {
    byTopic = new Map();
    displayableCache.set(messages, byTopic);
  }

  const key =
    topicId === undefined
      ? groupSlug
        ? `all:${groupSlug}`
        : 'all'
      : groupSlug
        ? `${topicId}:${groupSlug}`
        : String(topicId);
  const cached = byTopic.get(key);

  if (cached) {
    return cached;
  }

  const displayable = computeDisplayableMessages(messages, topicId, groupSlug);
  byTopic.set(key, displayable);

  return displayable;
}

const messageIdIndexCache = new WeakMap<
  TelegramMessage[],
  Map<number, TelegramMessage>
>();

function getMessageIdIndex(
  messages: TelegramMessage[]
): Map<number, TelegramMessage> {
  const cached = messageIdIndexCache.get(messages);

  if (cached) {
    return cached;
  }

  const index = new Map(messages.map((message) => [message.id, message]));
  messageIdIndexCache.set(messages, index);

  return index;
}

export function buildReplyPoolForPage(
  pageMessages: TelegramMessage[],
  displayable: TelegramMessage[]
): TelegramMessage[] {
  const index = getMessageIdIndex(displayable);
  const pool: TelegramMessage[] = [];
  const seen = new Set<number>();

  for (const message of pageMessages) {
    const replyTo = message.reply_to;

    if (!replyTo || seen.has(replyTo)) {
      continue;
    }

    const reply = index.get(replyTo);

    if (!reply) {
      continue;
    }

    seen.add(replyTo);
    pool.push(reply);
  }

  return pool;
}
