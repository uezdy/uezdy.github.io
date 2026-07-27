export function formatCount(value: number | null | undefined): string {
  if (value == null) {
    return '—';
  }

  return value.toLocaleString('ru-RU');
}
