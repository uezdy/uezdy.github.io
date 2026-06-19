export function normalizeChatHandle(chat: string): string {
  return chat.replace(/^@/, '');
}

export function buildTelegramMessageUrl(
  chatHandle: string,
  messageId: number,
  topicId: number | null,
  isForum: boolean
): string {
  const handle = normalizeChatHandle(chatHandle);

  if (isForum && topicId) {
    return `https://t.me/${handle}/${topicId}/${messageId}`;
  }

  return `https://t.me/${handle}/${messageId}`;
}

export function buildTelegramMessageEmbedUrl(
  chatHandle: string,
  messageId: number
): string {
  const handle = normalizeChatHandle(chatHandle);

  return `https://t.me/${handle}/${messageId}?embed=1`;
}
