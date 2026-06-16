import fs from 'fs';
import path from 'path';
import type { ExportState, TelegramMessage } from '@/types/telegram';

function readJsonFile<T>(relativePath: string, fallback: T): T {
  const filePath = path.join(process.cwd(), relativePath);

  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

export function getMessages(): TelegramMessage[] {
  const messages = readJsonFile<TelegramMessage[]>(
    'public/messages.json',
    []
  );

  return [...messages].sort((left, right) => left.id - right.id);
}

export function getExportState(): ExportState | null {
  return readJsonFile<ExportState | null>('public/export_state.json', null);
}
