import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drzwclnecktguodpokir.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // TEMP DEBUG ONLY — unminified prod build to decode the #418/#423 hydration stack trace.
  // Revert before any deploy.
  webpack(config) {
    config.optimization.minimize = false
    return config
  },
  async redirects() {
    // Garden Tour was renamed to Lab Tour (Session 40) — old bookmarks and any indexed
    // /garden links keep working instead of 404ing. Both locales, since next-intl's
    // 'as-needed' prefix means English has no /en segment.
    return [
      { source: '/garden', destination: '/lab', permanent: true },
      { source: '/es/garden', destination: '/es/lab', permanent: true },
    ]
  },
}

export default withNextIntl(nextConfig)
