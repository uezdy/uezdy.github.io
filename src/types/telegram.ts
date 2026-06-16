export type TelegramMessage = {
  id: number;
  date: string | null;
  sender_id: number | null;
  text: string;
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
