import type { TelegramMessage } from '@/types/telegram';

export function buildSearchText(message: TelegramMessage): string {
  return [message.text, String(message.sender_id ?? ''), String(message.id)]
    .join(' ')
    .toLowerCase();
}
