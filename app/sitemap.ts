import type { MetadataRoute } from 'next';

import { PUBLIC_ROUTES, SITE_URL } from '@/lib/site';

/**
 * XML sitemap for the site's public routes.
 *
 * Driven by `PUBLIC_ROUTES` so it can never drift from the HTML sitemap or
 * accidentally expose auth/dashboard routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}