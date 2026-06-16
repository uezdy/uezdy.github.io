import type { TelegramMessage } from '@/types/telegram';

export function plainPreview(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

export function getMessagePlainText(
  message: Pick<TelegramMessage, 'text' | 'entities'>
): string {
  if (message.entities.length > 0) {
    return message.entities.map((entity) => entity.text).join('');
  }

  return message.text;
}

export function plainPreviewFromMessage(
  message: Pick<TelegramMessage, 'text' | 'entities'>,
  maxLength = 160
): string {
  return plainPreview(getMessagePlainText(message), maxLength);
}

export function formatSenderLabel(
  senderName: string | null | undefined,
  senderId: number | null
): string {
  if (senderName?.trim()) {
    return senderName.trim();
  }

  if (senderId != null) {
    return String(senderId);
  }

  return 'Удалённый аккаунт';
}
