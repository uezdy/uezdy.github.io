import { getMessagePlainText } from '@/lib/messageText';
import { GENERAL_TOPIC_ID } from '@/lib/topicConstants';
import type { TelegramMessage } from '@/types/telegram';

export function hasDisplayText(message: TelegramMessage): boolean {
  return getMessagePlainText(message).trim().length > 0;
}

export function resolveMessageTopicId(message: TelegramMessage): number {
  return message.topic_id ?? GENERAL_TOPIC_ID;
}

export function filterMessagesByTopic(
  messages: TelegramMessage[],
  topicId: number
): TelegramMessage[] {
  return messages.filter(
    (message) => resolveMessageTopicId(message) === topicId
  );
}

const displayableCache = new WeakMap<
  TelegramMessage[],
  Map<string, TelegramMessage[]>
>();

function computeDisplayableMessages(
  messages: TelegramMessage[],
  topicId?: number
): TelegramMessage[] {
  const scoped =
    topicId === undefined ? messages : filterMessagesByTopic(messages, topicId);

  return scoped.filter(hasDisplayText);
}

export function getDisplayableMessages(
  messages: TelegramMessage[],
  topicId?: number
): TelegramMessage[] {
  let byTopic = displayableCache.get(messages);

  if (!byTopic) {
    byTopic = new Map();
    displayableCache.set(messages, byTopic);
  }

  const key = topicId === undefined ? 'all' : String(topicId);
  const cached = byTopic.get(key);

  if (cached) {
    return cached;
  }

  const displayable = computeDisplayableMessages(messages, topicId);
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
