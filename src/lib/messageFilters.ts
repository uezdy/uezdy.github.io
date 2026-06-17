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

export function getDisplayableMessages(
  messages: TelegramMessage[],
  topicId?: number
): TelegramMessage[] {
  const scoped =
    topicId === undefined
      ? messages
      : filterMessagesByTopic(messages, topicId);

  return scoped.filter(hasDisplayText);
}
