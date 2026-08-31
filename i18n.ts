import { getRequestConfig } from 'next-intl/server'
import { applyContentOverrides } from '@/lib/site-content'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  // Falls back to the default locale (rather than 404ing) for routes outside next-intl's
  // middleware — e.g. /admin, an internal tool with no locale segment. Locale-prefixed content
  // routes are still validated by the middleware itself before they ever get here.
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }
  const messages = (await import(`./messages/${locale}.json`)).default
  return {
    locale,
    // Anything the owner has edited in /admin/content wins over the shipped text.
    messages: await applyContentOverrides(messages, locale),
  }
})
