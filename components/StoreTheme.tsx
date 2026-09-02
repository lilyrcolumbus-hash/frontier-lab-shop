import { getStoreThemeCss } from '@/lib/store-theme'

/**
 * The store's palette overrides, as a style tag.
 *
 * Rendered from the layouts that are already dynamic rather than the root layout: making the
 * root async turns every page in the app dynamic, and it was where a hydration mismatch crept
 * in. Nothing renders when the palette is untouched — the defaults live in globals.css.
 */
export async function StoreTheme() {
  const css = await getStoreThemeCss()
  if (!css) return null
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
