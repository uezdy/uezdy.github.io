import type { MetadataRoute } from 'next';
import { getLegacyRouteDisallowPaths } from '@/lib/legacyRoutes';
import { absoluteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: getLegacyRouteDisallowPaths(),
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
