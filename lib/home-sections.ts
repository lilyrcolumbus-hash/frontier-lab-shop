import { prisma } from '@/lib/prisma'

const STORE_SLUG = process.env.STORE_SLUG ?? 'frontier-lab'

/**
 * The sections the home page can show, in the order it ships with.
 *
 * The code owns *what exists* — a section is a real React component, so the panel cannot invent
 * one. The database owns *whether it shows and in what order*, which is what /admin/appearance
 * edits. A key that is missing from the database simply falls back to the defaults here.
 */
export const HOME_SECTIONS = [
  { key: 'hero', label: 'Hero', description: 'The full-screen opening with the video background' },
  { key: 'trust', label: 'Trust bar', description: 'The row of numbers under the hero' },
  { key: 'growJourney', label: 'Grow journey', description: 'The four steps from culture to harvest' },
  { key: 'videoWild', label: 'Wild genetics video', description: 'The full-width forest video' },
  { key: 'wild', label: 'Wild section', description: 'The parallax section about wild strains' },
  { key: 'species', label: 'Species spotlight', description: 'Featured species cards' },
  { key: 'quiz', label: 'Species finder teaser', description: 'The prompt to take the quiz' },
  { key: 'academy', label: 'Academy preview', description: 'Featured articles' },
  { key: 'gallery', label: 'Community gallery', description: 'The grid of grower photos' },
  { key: 'newsletter', label: 'Newsletter', description: 'The email sign-up' },
] as const

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]['key']

export interface ResolvedSection {
  key: HomeSectionKey
  enabled: boolean
  sortOrder: number
}

/** The layout to render: the shipped list, with the store's own order and visibility applied. */
export async function getHomeLayout(): Promise<ResolvedSection[]> {
  const defaults: ResolvedSection[] = HOME_SECTIONS.map((section, index) => ({
    key: section.key,
    enabled: true,
    sortOrder: index,
  }))

  try {
    const rows = await prisma.homeSection.findMany({ where: { store: { slug: STORE_SLUG } } })
    if (rows.length === 0) return defaults

    const byKey = new Map(rows.map((row) => [row.key, row]))
    return defaults
      .map((section) => {
        const row = byKey.get(section.key)
        return row ? { ...section, enabled: row.enabled, sortOrder: row.sortOrder } : section
      })
      .sort((a, b) => a.sortOrder - b.sortOrder)
  } catch (err) {
    // A database problem must not empty the home page.
    console.error('[home-sections] could not load the layout, using the default order', err)
    return defaults
  }
}
