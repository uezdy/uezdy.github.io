import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

export function formatMessageDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return format(date, 'd MMMM yyyy, HH:mm', { locale: ru });
}

export function formatExportDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return format(date, 'd MMMM yyyy, HH:mm', { locale: ru });
}
