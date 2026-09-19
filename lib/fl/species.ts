import type { SpeciesData } from '@/lib/species-data'
import { flGet, isSlug } from '@/lib/fl/client'
import { toSpeciesData, type FlSpeciesRow } from '@/lib/fl/mappers'

const COLUMNS =
  'slug,common_name,scientific_name,family,taxonomic_order,type,difficulty,substrate,colonization_weeks_min,colonization_weeks_max,fruiting_temp_f_min,fruiting_temp_f_max,fruiting_temp_c_min,fruiting_temp_c_max,expected_flushes,biological_efficiency,beta_glucan_content,indoor_outdoor,description,cultivation_notes,medical_notes,cooking_notes,lookalikes,image_url,thumbnail_url,openart_prompt,key_benefits'

export async function listSpecies(): Promise<SpeciesData[]> {
  const rows = await flGet<FlSpeciesRow>('species', { select: COLUMNS, order: 'common_name.asc' })
  return rows.map(toSpeciesData)
}

export async function getSpecies(slug: string): Promise<SpeciesData | null> {
  if (!isSlug(slug)) return null
  const [row] = await flGet<FlSpeciesRow>('species', { select: COLUMNS, filters: { slug: `eq.${slug}` }, limit: 1 })
  return row ? toSpeciesData(row) : null
}

/** Slugs with their last-changed time, for the sitemap. */
export async function listSpeciesSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  return flGet('species', { select: 'slug,updated_at', order: 'common_name.asc' })
}
