import type { MetadataRoute } from 'next';
import {
  isLastMessagePage,
  readSitemapState,
} from '@/lib/sitemapState';
import { absoluteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-static';

function resolveChangeFrequency(
  path: string
): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (path === '/') {
    return 'weekly';
  }

  if (/^\/[^/]+\/$/.test(path)) {
    return 'monthly';
  }

  if (/\/messages\/\d+\/$/.test(path)) {
    return isLastMessagePage(path) ? 'weekly' : 'yearly';
  }

  return 'monthly';
}

function resolvePriority(path: string): number {
  if (path === '/') {
    return 1;
  }

  if (/^\/[^/]+\/$/.test(path)) {
    return 0.8;
  }

  if (/\/messages\/\d+\/$/.test(path)) {
    return isLastMessagePage(path) ? 0.7 : 0.6;
  }

  return 0.6;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const state = readSitemapState();

  return Object.entries(state.urls)
    .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
    .map(([path, urlState]) => ({
      url: absoluteUrl(path),
      lastModified: new Date(urlState.lastModified),
      changeFrequency: resolveChangeFrequency(path),
      priority: resolvePriority(path),
    }));
}
