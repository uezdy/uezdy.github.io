export function plainPreview(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

export function formatSenderLabel(senderId: number | null): string {
  if (senderId == null) {
    return 'Удалённый аккаунт';
  }

  return String(senderId);
}
