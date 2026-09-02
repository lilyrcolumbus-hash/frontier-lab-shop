import { createNavigation } from 'next-intl/navigation'
import { defaultLocale, locales } from './i18n'

// `as-needed` drops the prefix for the default locale, so next-intl has to be told which locale
// that is. Without it this throws the moment a server component imports Link — for a long time
// only client components did, which is why it was mistaken for a dev-only glitch.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})
