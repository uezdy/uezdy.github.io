export type TelegramMessage = {
  id: number;
  date: string | null;
  sender_id: number | null;
  text: string;
  reply_to: number | null;
  has_media: boolean;
  media_type: string | null;
};

export type ExportState = {
  chat: string;
  last_message_id: number;
  message_count: number;
  exported_at: string;
};
