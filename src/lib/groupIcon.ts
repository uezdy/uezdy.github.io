import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';

export const GROUP_ICON_FILE = 'icon.jpg';

export function getGroupIconPath(slug: string): string {
  return `/groups/${slug}/${GROUP_ICON_FILE}`;
}

export function hasGroupIcon(slug: string): boolean {
  const filePath = path.join(
    process.cwd(),
    'public',
    'groups',
    slug,
    GROUP_ICON_FILE
  );

  return fs.existsSync(filePath);
}

export function groupIconMetadata(
  slug: string
): Pick<Metadata, 'icons'> | Record<string, never> {
  if (!hasGroupIcon(slug)) {
    return {};
  }

  const icon = getGroupIconPath(slug);

  return {
    icons: {
      icon,
      apple: icon,
    },
  };
}
