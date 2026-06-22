import path from 'path';
import { readJsonFile } from '@/lib/readJson';
import { normalizeChatHandle } from '@/lib/telegramChat';
import type {
  ExportState,
  GroupSummary,
  GroupsManifest,
  TelegramGroupConfig,
} from '@/types/telegram';

const MANIFEST_PATH = 'public/groups.json';

function groupDir(slug: string): string {
  return path.posix.join('public', 'groups', slug);
}

export function getGroupDataPath(slug: string, fileName: string): string {
  return path.posix.join(groupDir(slug), fileName);
}

export function getGroups(): TelegramGroupConfig[] {
  const manifest = readJsonFile<GroupsManifest>(MANIFEST_PATH, { groups: [] });

  return manifest.groups;
}

export function getGroup(slug: string): TelegramGroupConfig | null {
  return getGroups().find((group) => group.slug === slug) ?? null;
}

export function enrichGroupWithExportState(
  group: TelegramGroupConfig,
  exportState: ExportState | null
): TelegramGroupConfig {
  const title = group.title ?? exportState?.title;

  if (!title) {
    return group;
  }

  return { ...group, title };
}

export function resolveGroupTitle(
  group: TelegramGroupConfig,
  exportState?: ExportState | null
): string {
  return group.title ?? exportState?.title ?? group.chat;
}

export function chatToSlug(chat: string): string {
  return normalizeChatHandle(chat);
}

export function getGroupSummaries(): GroupSummary[] {
  return getGroups().map((group) => {
    const exportState = readJsonFile<ExportState | null>(
      getGroupDataPath(group.slug, 'export_state.json'),
      null
    );
    const messages = readJsonFile<unknown[]>(
      getGroupDataPath(group.slug, 'messages.json'),
      []
    );

    return {
      ...enrichGroupWithExportState(group, exportState),
      messageCount: exportState?.message_count ?? messages.length,
      topicCount: exportState?.topic_count ?? 0,
      isForum: exportState?.is_forum ?? false,
      exportedAt: exportState?.exported_at ?? null,
    };
  });
}
