/**
 * Where each pin sits on each scene of the Lab Tour. Only positions and product slugs live here:
 * names, prices and photos are read from the real catalog (app/[locale]/lab/page.tsx), so the
 * tour can never show a product the shop does not sell. Scene names, subtitles and background
 * photos are editable text in /admin -> Content (lab.tour.scenes.*).
 */
export const SCENE_LAYOUT = [
  { id: 'grow-room', hotspots: [
    { id: 'hs-1', x: 28, y: 48, slug: 'blue-oyster-fruiting-block' },
    { id: 'hs-2', x: 68, y: 42, slug: 'lions-mane-fruiting-block' },
  ] },
  { id: 'spawn-lab', hotspots: [
    { id: 'hs-3', x: 38, y: 52, slug: 'blue-oyster-bulk-substrate' },
    { id: 'hs-4', x: 68, y: 38, slug: 'blue-oyster-liquid-culture' },
  ] },
  { id: 'fruiting-room', hotspots: [
    { id: 'hs-5', x: 52, y: 44, slug: 'shiitake-fruiting-block' },
    { id: 'hs-5b', x: 30, y: 60, slug: 'golden-oyster-fruiting-block' },
  ] },
  { id: 'reishi', hotspots: [
    { id: 'hs-6', x: 48, y: 50, slug: 'reishi-fruiting-block' },
  ] },
] as const

export const LAB_SLUGS: string[] = SCENE_LAYOUT.flatMap((scene) => scene.hotspots.map((hotspot) => hotspot.slug))
