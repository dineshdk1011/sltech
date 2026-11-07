import type { MetadataRoute } from 'next';

import { PRIVATE_ROUTE_PREFIXES, SITE_URL } from '@/lib/site';

/**
 * Dynamic robots.txt.
 *
 * Auth-gated and internal dashboards are disallowed so crawlers do not waste
 * crawl budget on them and so no thin/private URL can ever be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_ROUTE_PREFIXES.map((prefix) => `${prefix}/`),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}