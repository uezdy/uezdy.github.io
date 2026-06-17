import type { MetadataRoute } from 'next';
import { getGroupSummaries } from '@/lib/groups';
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

export default function sitemap(): MetadataRoute.Sitemap {
  const groups = getGroupSummaries();
  const homeLastModified = getLatestExportDate(groups);

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl('/'),
    changeFrequency: 'weekly',
    priority: 1,
    ...(homeLastModified ? { lastModified: homeLastModified } : {}),
  };

  const groupEntries: MetadataRoute.Sitemap = groups.map((group) => ({
    url: absoluteUrl(`/${group.slug}/`),
    changeFrequency: 'weekly',
    priority: 0.8,
    ...(group.exportedAt
      ? { lastModified: new Date(group.exportedAt) }
      : {}),
  }));

  return [homeEntry, ...groupEntries];
}
