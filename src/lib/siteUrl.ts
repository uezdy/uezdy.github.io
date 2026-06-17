const DEFAULT_SITE_URL = 'https://uezdy.github.io';

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return url.replace(/\/$/, '');
}

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath}`;
}
