// Self-check for lib/fl/mappers.ts: `node scripts/check-fl-mappers.ts`.
// Exits non-zero on the first wrong result. Expected values are worked out by hand.
import { productSeo, toCents, toProduct, toSpeciesData } from '../lib/fl/mappers.ts'
import type { FlProductRow, FlSpeciesRow } from '../lib/fl/mappers.ts'

let failures = 0
function check(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures += 1
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : `\n     expected ${JSON.stringify(expected)}\n     actual   ${JSON.stringify(actual)}`}`)
}

const photo = (entry: string) => `PHOTO(${entry})`
const row = (extra: Partial<FlProductRow> = {}): FlProductRow => ({
  slug: 'lions-mane-liquid-culture', category: 'spawn', subcategory: 'Liquid Culture', species_slug: 'lions-mane',
  scientific_name: 'Hericium erinaceus', name: { en: "Lion's Mane LC", es: 'LC Melena de León' },
  description: { en: 'Desc', es: 'Descr' }, price: '17.99', compare_at_price: '19.99', sku: 'LC-LM', is_organic: true,
  tags: ['lc'], related_products: ['grain-bag'], seo: null, photos: ['/images/a.jpg', 'https://x/b.jpg', 'blog/1-a.png'],
  stock: 50, details: { variant_name: '10cc', image_alts: ['one'] }, ...extra,
})

// ── money
check('17.99 dollars is 1799 cents', toCents('17.99'), 1799)
check('a number works too', toCents(23.04), 2304)
check('0.29 (binary float says 28.999…)', toCents(0.29), 29)
check('whole dollars', toCents(30), 3000)

// ── products
const p = toProduct(row(), photo)
check('id and slug are the slug', [p.id, p.slug], ['lions-mane-liquid-culture', 'lions-mane-liquid-culture'])
check('price and compare-at in cents', [p.price, p.compareAtPrice], [1799, 1999])
check('one variant, id = slug, named from details', p.variants, [{ id: 'lions-mane-liquid-culture', name: '10cc', price: 1799, stock: 50, sku: 'LC-LM' }])
check('photos go through the resolver, in order', p.images, ['PHOTO(/images/a.jpg)', 'PHOTO(https://x/b.jpg)', 'PHOTO(blog/1-a.png)'])
check('alt text comes from details', p.imageAlts, ['one'])
check('species, scientific name, organic, tags, related', [p.species, p.scientificName, p.isOrganic, p.tags, p.relatedProducts], ['lions-mane', 'Hericium erinaceus', true, ['lc'], ['grain-bag']])
check('counted stock above zero is in stock', p.inStock, true)
check('stock 0 is sold out', toProduct(row({ stock: 0 }), photo).inStock, false)
check('stock 1 is in stock', toProduct(row({ stock: 1 }), photo).inStock, true)
const untracked = toProduct(row({ stock: null }), photo)
check('untracked stock always sells', untracked.inStock, true)
check('untracked stock shows no count', untracked.variants[0].stock, null)
check('no compare-at price', toProduct(row({ compare_at_price: null }), photo).compareAtPrice, undefined)
check('no details at all', toProduct(row({ details: null }), photo).variants[0].name, 'Default')
check('no details: no rich fields', (() => { const q = toProduct(row({ details: null }), photo); return [q.howToUseSteps, q.faqs, q.keyBenefits, q.cultivationSpecs, q.imageAlts] })(), [undefined, undefined, undefined, undefined, []])
check('no photos', toProduct(row({ photos: null }), photo).images, [])
check('null lists become empty lists', (() => { const q = toProduct(row({ tags: null, related_products: null }), photo); return [q.tags, q.relatedProducts] })(), [[], []])
check('empty Spanish falls back to English', toProduct(row({ name: { en: 'Only English', es: '' } }), photo).name, { en: 'Only English', es: 'Only English' })
check('missing Spanish falls back to English', toProduct(row({ name: { en: 'Only English' } }), photo).name.es, 'Only English')
check('whitespace-only Spanish falls back', toProduct(row({ name: { en: 'A', es: '   ' } }), photo).name.es, 'A')
check('null subcategory is empty text', toProduct(row({ subcategory: null }), photo).subcategory, '')
check('rich fields pass through', (() => {
  const q = toProduct(row({ details: { how_to_use_steps: ['a', 'b'], science_content: { en: 'S', es: 'C' }, grain_bag_specs: { bagSize: '3lb', sterilization: 'x', moisture: 'y', colonizationEstimate: 'z', recommendedInoculation: 'w', shelfLife: 'v' } } }), photo)
  return [q.howToUseSteps, q.scienceContent, q.grainBagSpecs?.bagSize]
})(), [['a', 'b'], { en: 'S', es: 'C' }, '3lb'])

// ── search listing
check('no seo', productSeo({ seo: null }, 'en'), { title: '', description: '' })
check('seo in English', productSeo({ seo: { title: { en: 'T', es: 'Tt' }, description: { en: 'D', es: 'Dd' } } }, 'en'), { title: 'T', description: 'D' })
check('seo in Spanish', productSeo({ seo: { title: { en: 'T', es: 'Tt' }, description: { en: 'D', es: 'Dd' } } }, 'es'), { title: 'Tt', description: 'Dd' })
check('Spanish seo falls back to English when missing', productSeo({ seo: { title: { en: 'T' } } }, 'es').title, 'T')
check('seo is trimmed', productSeo({ seo: { title: { en: '  T  ' } } }, 'en').title, 'T')

// ── species
const species: FlSpeciesRow = {
  slug: 'blue-oyster', common_name: 'Blue Oyster', scientific_name: 'Pleurotus ostreatus', family: 'Pleurotaceae', taxonomic_order: 'Agaricales',
  type: 'edible', difficulty: 'beginner', substrate: ['Straw'], colonization_weeks_min: 2, colonization_weeks_max: 3,
  fruiting_temp_f_min: 55, fruiting_temp_f_max: 65, fruiting_temp_c_min: 13, fruiting_temp_c_max: 18, expected_flushes: 3,
  biological_efficiency: '25%', beta_glucan_content: 'High', indoor_outdoor: 'both', description: { en: 'D', es: '' },
  cultivation_notes: { en: 'C', es: 'Cc' }, medical_notes: { en: 'M', es: 'Mm' }, cooking_notes: { en: 'K', es: 'Kk' }, lookalikes: [],
  image_url: 'https://x/i.png', thumbnail_url: null, openart_prompt: null, key_benefits: null,
}
const s = toSpeciesData(species)
check('species ranges', [s.colonizationWeeks, s.fruitingTempF, s.fruitingTempC], [{ min: 2, max: 3 }, { min: 55, max: 65 }, { min: 13, max: 18 }])
check('species id is the slug and order is the taxonomic order', [s.id, s.order], ['blue-oyster', 'Agaricales'])
check('thumbnail falls back to the image', s.thumbnailUrl, 'https://x/i.png')
check('empty Spanish description falls back', s.description, { en: 'D', es: 'D' })
check('null benefits become an empty list', s.keyBenefits, [])
check('null OpenArt prompt is left out', s.openartPrompt, undefined)
const sparse = toSpeciesData({ ...species, scientific_name: null, family: null, taxonomic_order: null, type: null, difficulty: null, substrate: null, colonization_weeks_min: null, colonization_weeks_max: null, image_url: null, thumbnail_url: null, lookalikes: null, indoor_outdoor: null, expected_flushes: null, biological_efficiency: null, beta_glucan_content: null })
check('a sparse species still has every required field', [sparse.scientificName, sparse.family, sparse.order, sparse.type, sparse.difficulty, sparse.substrate, sparse.colonizationWeeks, sparse.imageUrl, sparse.thumbnailUrl, sparse.lookalikes, sparse.indoorOutdoor, sparse.expectedFlushes],
  ['', '', '', 'edible', 'beginner', [], { min: 0, max: 0 }, '', '', [], 'indoor', 0])

if (failures > 0) {
  console.log(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall checks passed')
