import type { MetadataRoute } from 'next';
import {
  getGroupArchiveContext,
  getGroupMessagePageParams,
  getTopicMessagePageParams,
} from '@/lib/groupArchive';
import { getGroupSummaries, getGroups } from '@/lib/groups';
import {
  groupMessagesPagePath,
  groupOverviewPath,
  topicMessagesPagePath,
} from '@/lib/groupRoutes';
import { absoluteUrl } from '@/lib/siteUrl';
import type { GroupSummary } from '@/types/telegram';

export const dynamic = 'force-static';

function getLatestExportDate(groups: GroupSummary[]): Date | undefined {
  const timestamps = groups
    .map((group) => group.exportedAt)
    .filter((value): value is string => value !== null)
    .map((value) => new Date(value).getTime())
    .filter((value) => !Number.isNaN(value));

  if (timestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...timestamps));
}

function buildGroupEntry(
  group: GroupSummary
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(groupOverviewPath(group.slug)),
    changeFrequency: 'weekly',
    priority: 0.8,
    ...(group.exportedAt
      ? { lastModified: new Date(group.exportedAt) }
      : {}),
  };
}

function buildGroupLastModifiedMap(): Map<string, Date | undefined> {
  const lastModifiedByGroup = new Map<string, Date | undefined>();

  for (const group of getGroups()) {
    const context = getGroupArchiveContext(group.slug);
    const lastModified = context?.exportState?.exported_at
      ? new Date(context.exportState.exported_at)
      : undefined;
    lastModifiedByGroup.set(group.slug, lastModified);
  }

  return lastModifiedByGroup;
}

function buildMessagePageEntries(
  lastModifiedByGroup: Map<string, Date | undefined>
): MetadataRoute.Sitemap {
  return getGroupMessagePageParams().map(({ group, page }) => {
    const lastModified = lastModifiedByGroup.get(group);

    return {
      url: absoluteUrl(groupMessagesPagePath(group, Number(page))),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      ...(lastModified ? { lastModified } : {}),
    };
  });
}

function buildTopicPageEntries(
  lastModifiedByGroup: Map<string, Date | undefined>
): MetadataRoute.Sitemap {
  return getTopicMessagePageParams().map(({ group, topicId, page }) => {
    const lastModified = lastModifiedByGroup.get(group);

    return {
      url: absoluteUrl(
        topicMessagesPagePath(group, Number(topicId), Number(page))
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      ...(lastModified ? { lastModified } : {}),
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const groups = getGroupSummaries();
  const homeLastModified = getLatestExportDate(groups);
  const lastModifiedByGroup = buildGroupLastModifiedMap();

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl('/'),
    changeFrequency: 'weekly',
    priority: 1,
    ...(homeLastModified ? { lastModified: homeLastModified } : {}),
  };

  return [
    homeEntry,
    ...groups.map(buildGroupEntry),
    ...buildMessagePageEntries(lastModifiedByGroup),
    ...buildTopicPageEntries(lastModifiedByGroup),
  ];
}
