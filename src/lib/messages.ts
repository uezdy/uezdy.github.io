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

const messagesCache = new Map<string, TelegramMessage[]>();
const exportStateCache = new Map<string, ExportState | null>();

function loadMessages(groupSlug: string): TelegramMessage[] {
  const messages = readJsonFile<TelegramMessage[]>(
    getGroupDataPath(groupSlug, 'messages.json'),
    []
  );

  return [...messages]
    .map(normalizeMessage)
    .sort((left, right) => left.id - right.id);
}

export function getMessages(groupSlug: string): TelegramMessage[] {
  const cached = messagesCache.get(groupSlug);

  if (cached) {
    return cached;
  }

  const messages = loadMessages(groupSlug);
  messagesCache.set(groupSlug, messages);

  return messages;
}

export function getExportState(groupSlug: string): ExportState | null {
  const cached = exportStateCache.get(groupSlug);

  if (cached !== undefined) {
    return cached;
  }

  const exportState = readJsonFile<ExportState | null>(
    getGroupDataPath(groupSlug, 'export_state.json'),
    null
  );
  exportStateCache.set(groupSlug, exportState);

  return exportState;
}
