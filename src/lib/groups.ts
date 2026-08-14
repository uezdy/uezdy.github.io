import path from 'path';
import { groupOverviewPath } from '@/lib/groupRoutes';
import { readJsonFile } from '@/lib/readJson';
import { absoluteUrl } from '@/lib/siteUrl';
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

export function isLocalArchiveGroup(group: TelegramGroupConfig): boolean {
  return !group.skipExport;
}

export function getLocalArchiveGroups(): TelegramGroupConfig[] {
  return getGroups().filter(isLocalArchiveGroup);
}

export function groupArchiveHref(group: TelegramGroupConfig): string {
  const overviewPath = groupOverviewPath(group.slug);

  if (group.skipExport) {
    return absoluteUrl(overviewPath);
  }

  return overviewPath;
}

export function enrichGroupWithExportState(
  group: TelegramGroupConfig,
  exportState: ExportState | null
): TelegramGroupConfig {
  const title = group.title ?? exportState?.title;
  const chat = group.chat ?? exportState?.chat;

  if (!title && !chat) {
    return group;
  }

  return {
    ...group,
    ...(title ? { title } : {}),
    ...(chat ? { chat } : {}),
  };
}

export function resolveGroupChatHandle(
  group: TelegramGroupConfig,
  exportState?: ExportState | null
): string {
  return (
    group.chat ??
    exportState?.chat ??
    (group.id !== undefined ? String(group.id) : group.slug)
  );
}

export function resolveGroupTitle(
  group: TelegramGroupConfig,
  exportState?: ExportState | null
): string {
  return (
    group.title ?? exportState?.title ?? resolveGroupChatHandle(group, exportState)
  );
}

export function chatToSlug(chat: string): string {
  return normalizeChatHandle(chat);
}

export function getGroupSummaries(): GroupSummary[] {
  return getGroups().map((group) => {
    if (group.skipExport) {
      return {
        ...group,
        messageCount: 0,
        topicCount: 0,
        memberCount: null,
        isForum: false,
        exportedAt: null,
      };
    }

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
      memberCount: exportState?.member_count ?? null,
      isForum: exportState?.is_forum ?? false,
      exportedAt: exportState?.exported_at ?? null,
    };
  });
}
