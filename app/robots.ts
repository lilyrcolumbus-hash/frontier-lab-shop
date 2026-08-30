import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing here is secret — these paths are gated server-side — but they are worthless
      // in search results and would only dilute the store's own pages.
      disallow: ['/admin', '/api/', '/auth/', '/account', '/checkout/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
