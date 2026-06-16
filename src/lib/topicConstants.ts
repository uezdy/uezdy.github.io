import type { TelegramTopic } from '@/types/telegram';

export const GENERAL_TOPIC_ID = 1;

export type TopicWithCount = TelegramTopic & {
  message_count: number;
};
