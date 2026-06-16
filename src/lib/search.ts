import type { TelegramMessage } from '@/types/telegram';
import { getMessagePlainText } from '@/lib/messageText';

export function buildSearchText(message: TelegramMessage): string {
  return [
    getMessagePlainText(message),
    message.sender_name ?? '',
    String(message.sender_id ?? ''),
    String(message.id),
  ]
    .join(' ')
    .toLowerCase();
}
