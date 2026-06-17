import { getGroupDataPath } from '@/lib/groups';
import { readJsonFile } from '@/lib/readJson';
import type {
  ExportState,
  TelegramMessage,
  TextEntity,
} from '@/types/telegram';

function buildFallbackEntities(text: string): TextEntity[] {
  if (!text) {
    return [];
  }

  return [{ type: 'plain', text }];
}

function normalizeMessage(message: TelegramMessage): TelegramMessage {
  const entities =
    message.entities && message.entities.length > 0
      ? message.entities
      : buildFallbackEntities(message.text);

  return {
    ...message,
    topic_id: message.topic_id ?? null,
    sender_name: message.sender_name ?? null,
    entities,
  };
}

export function getMessages(groupSlug: string): TelegramMessage[] {
  const messages = readJsonFile<TelegramMessage[]>(
    getGroupDataPath(groupSlug, 'messages.json'),
    []
  );

  return [...messages]
    .map(normalizeMessage)
    .sort((left, right) => left.id - right.id);
}

export function getExportState(groupSlug: string): ExportState | null {
  return readJsonFile<ExportState | null>(
    getGroupDataPath(groupSlug, 'export_state.json'),
    null
  );
}
