import path from 'path';
import { readJsonFile } from '@/lib/readJson';
import { normalizeChatHandle } from '@/lib/telegramChat';
import type {
  ExportState,
  GroupsManifest,
  TelegramGroupConfig,
} from '@/types/telegram';

const MANIFEST_PATH = 'public/groups.json';

export const PRIMARY_GROUP_SLUG = 'uezdy';

function groupDir(slug: string): string {
  return path.posix.join('public', 'groups', slug);
}

export function getGroupDataPath(slug: string, fileName: string): string {
  return path.posix.join(groupDir(slug), fileName);
}

/** Reads groups.json as a single group object and returns it as a list. */
export function loadGroupsFromManifest(
  relativePath: string
): TelegramGroupConfig[] {
  const group = readJsonFile<GroupsManifest | null>(relativePath, null);

  if (!group?.slug || !group?.chat) {
    return [];
  }

  return [group];
}

export function getGroups(): TelegramGroupConfig[] {
  return loadGroupsFromManifest(MANIFEST_PATH);
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

