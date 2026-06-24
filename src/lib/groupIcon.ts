import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const GROUP_ICON_SOURCE = 'icon.jpg';
export const GROUP_ICON_CARD = 'icon-48.webp';
export const GROUP_ICON_CARD_2X = 'icon-96.webp';
export const GROUP_ICON_FAVICON = 'icon-32.webp';
export const GROUP_ICON_APPLE = 'icon-192.webp';

function getPublicGroupIconPath(slug: string, fileName: string): string {
  return path.join(process.cwd(), 'public', 'groups', slug, fileName);
}

export function getGroupIconCardPath(slug: string): string {
  return `/groups/${slug}/${GROUP_ICON_CARD}`;
}

export function getGroupIconCardSrcSet(slug: string): string {
  return `${getGroupIconCardPath(slug)} 1x, /groups/${slug}/${GROUP_ICON_CARD_2X} 2x`;
}

export function hasGroupIcon(slug: string): boolean {
  return fs.existsSync(getPublicGroupIconPath(slug, GROUP_ICON_CARD));
}

export function groupIconMetadata(
  slug: string
): Pick<Metadata, 'icons'> | Record<string, never> {
  if (!hasGroupIcon(slug)) {
    return {};
  }

  return {
    icons: {
      icon: `/groups/${slug}/${GROUP_ICON_FAVICON}`,
      apple: `/groups/${slug}/${GROUP_ICON_APPLE}`,
    },
  };
}
