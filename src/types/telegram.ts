export type TextEntity = {
  type: string;
  text: string;
  href?: string;
  language?: string;
  user_id?: number;
};

export type TelegramMessage = {
  id: number;
  date: string | null;
  sender_id: number | null;
  sender_name: string | null;
  text: string;
  entities: TextEntity[];
  reply_to: number | null;
  topic_id: number | null;
  has_media: boolean;
  media_type: string | null;
};

export type TelegramTopic = {
  id: number;
  title: string;
};

export type ExportState = {
  chat: string;
  last_message_id: number;
  message_count: number;
  topic_count: number;
  is_forum: boolean;
  exported_at: string;
};

export type TelegramGroupConfig = {
  slug: string;
  chat: string;
  title?: string;
};

export type GroupsManifest = {
  groups: TelegramGroupConfig[];
};

export type GroupSummary = TelegramGroupConfig & {
  messageCount: number;
  topicCount: number;
  isForum: boolean;
  exportedAt: string | null;
};
