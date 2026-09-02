import { prisma } from '@/lib/prisma'
import { buildThemeCss, THEME_COLUMNS, type ThemeOverrides, type ThemeTokenKey } from '@/lib/theme'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

/**
 * The store's palette overrides as a `:root` block for the document head.
 *
 * Read on every render rather than cached, for the same reason as the site content: rendered
 * pages are already cached by Next, so this runs only on a real rebuild, and saving in the admin
 * revalidates those pages. Any failure falls back to the shipped palette rather than breaking
 * the page — an unstyled site is far worse than an un-customised one.
 */
export async function getStoreThemeCss(): Promise<string> {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: STORE_SLUG },
      select: {
        themeAccent: true,
        themeAmber: true,
        themeInk: true,
        themeInkMuted: true,
        themeBg: true,
        themeSurface: true,
        themeElevated: true,
        themeBorder: true,
      },
    })
    if (!store) return ''

    const overrides: ThemeOverrides = {}
    for (const [token, column] of Object.entries(THEME_COLUMNS)) {
      const value = (store as Record<string, string>)[column]
      if (value) overrides[token as ThemeTokenKey] = value
    }
    return buildThemeCss(overrides)
  } catch (err) {
    console.error('[store-theme] could not load the palette, using the shipped one', err)
    return ''
  }
}
