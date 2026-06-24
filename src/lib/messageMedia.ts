import type { TelegramMessage } from '@/types/telegram';

export type MessageMediaIconKind = 'photo' | 'file';

export function getMessageMediaIconKind(
  message: Pick<TelegramMessage, 'has_media' | 'media_type'>
): MessageMediaIconKind | null {
  if (!message.has_media || !message.media_type) {
    return null;
  }

  if (message.media_type === 'MessageMediaPhoto') {
    return 'photo';
  }

  if (message.media_type === 'MessageMediaDocument') {
    return 'file';
  }

  return null;
}

export function getMessageMediaLabel(kind: MessageMediaIconKind): string {
  return kind === 'photo' ? 'Фото' : 'Файл';
}
