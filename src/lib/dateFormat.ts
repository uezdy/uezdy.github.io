import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

function parseDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatMessageDate(value: string | null): string {
  const date = parseDate(value);

  if (!date) {
    return '—';
  }

  return format(date, 'd MMMM yyyy, HH:mm', { locale: ru });
}

export function formatMessageDateTimeShort(value: string | null): string {
  const date = parseDate(value);

  if (!date) {
    return '—';
  }

  return format(date, 'd MMM yyyy, HH:mm', { locale: ru });
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
