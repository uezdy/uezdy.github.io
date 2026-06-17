import { getGroup, getGroups, resolveGroupTitle } from '@/lib/groups';
import { getDisplayableMessages } from '@/lib/messageFilters';
import { getTotalPages, pageRange } from '@/lib/pagination';
import { getExportState, getMessages } from '@/lib/messages';
import { getTopics, hasForumTopics } from '@/lib/topics';
import type { TopicWithCount } from '@/lib/topicConstants';
import type {
  ExportState,
  TelegramGroupConfig,
  TelegramMessage,
} from '@/types/telegram';

export type GroupArchiveContext = {
  group: TelegramGroupConfig;
  slug: string;
  title: string;
  messages: TelegramMessage[];
  exportState: ExportState | null;
  topics: TopicWithCount[];
  showTopics: boolean;
};

const groupArchiveContextCache = new Map<string, GroupArchiveContext | null>();

function loadGroupArchiveContext(slug: string): GroupArchiveContext | null {
  const group = getGroup(slug);

  if (!group) {
    return null;
  }

  const messages = getMessages(slug);
  const exportState = getExportState(slug);
  const topics = getTopics(slug, messages);
  const showTopics = hasForumTopics(messages) && topics.length > 0;

  return {
    group,
    slug,
    title: resolveGroupTitle(group),
    messages,
    exportState,
    topics,
    showTopics,
  };
}

export function getGroupArchiveContext(
  slug: string
): GroupArchiveContext | null {
  const cached = groupArchiveContextCache.get(slug);

  if (cached !== undefined) {
    return cached;
  }

  const context = loadGroupArchiveContext(slug);
  groupArchiveContextCache.set(slug, context);

  return context;
}

export function getGroupMessagePageParams(): { group: string; page: string }[] {
  const params: { group: string; page: string }[] = [];

  for (const group of getGroups()) {
    const context = getGroupArchiveContext(group.slug);

    if (!context || context.showTopics) {
      continue;
    }

    const displayable = getDisplayableMessages(context.messages);
    const totalPages = getTotalPages(displayable.length);

    for (const page of pageRange(totalPages)) {
      params.push({ group: group.slug, page: String(page) });
    }
  }

  return params;
}

export function getTopicMessagePageParams(): {
  group: string;
  topicId: string;
  page: string;
}[] {
  const params: {
    group: string;
    topicId: string;
    page: string;
  }[] = [];

  for (const group of getGroups()) {
    const context = getGroupArchiveContext(group.slug);

    if (!context?.showTopics) {
      continue;
    }

    for (const topic of context.topics) {
      const displayable = getDisplayableMessages(context.messages, topic.id);
      const totalPages = getTotalPages(displayable.length);

      for (const page of pageRange(totalPages)) {
        params.push({
          group: group.slug,
          topicId: String(topic.id),
          page: String(page),
        });
      }
    }
  }

  return params;
}

/** Static export requires at least one path per dynamic route at build time. */
export function getGroupMessagePageParamsForExport(): {
  group: string;
  page: string;
}[] {
  const params = getGroupMessagePageParams();

  if (params.length > 0) {
    return params;
  }

  return getGroups().map((group) => ({
    group: group.slug,
    page: '1',
  }));
}

/** Static export requires at least one path per dynamic route at build time. */
export function getTopicMessagePageParamsForExport(): {
  group: string;
  topicId: string;
  page: string;
}[] {
  const params = getTopicMessagePageParams();

  if (params.length > 0) {
    return params;
  }

  return getGroups().map((group) => ({
    group: group.slug,
    topicId: '1',
    page: '1',
  }));
}
