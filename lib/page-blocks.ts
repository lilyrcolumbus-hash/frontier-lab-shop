import { z } from 'zod'

/**
 * Blocks are the unit a page is built from in /admin/pages.
 *
 * Deliberately a small, fixed set rather than free HTML: every block renders through a React
 * component with known props, so a page composed in the panel cannot break the layout or inject
 * markup. Text fields carry both languages because the storefront is bilingual.
 */

const bilingual = z.object({ en: z.string().default(''), es: z.string().default('') })

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ id: z.string(), type: z.literal('heading'), text: bilingual, level: z.enum(['h2', 'h3']).default('h2') }),
  z.object({ id: z.string(), type: z.literal('text'), text: bilingual }),
  z.object({ id: z.string(), type: z.literal('image'), url: z.string().default(''), alt: bilingual }),
  z.object({
    id: z.string(),
    type: z.literal('button'),
    label: bilingual,
    href: z.string().default('/'),
  }),
  z.object({ id: z.string(), type: z.literal('divider') }),
  z.object({ id: z.string(), type: z.literal('quote'), text: bilingual, attribution: bilingual }),
])

export type PageBlock = z.infer<typeof blockSchema>
export type BlockType = PageBlock['type']

export const blocksSchema = z.array(blockSchema).max(200)

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Heading',
  text: 'Paragraph',
  image: 'Image',
  button: 'Button',
  divider: 'Divider',
  quote: 'Quote',
}

/** A fresh block of the given type, with an id that is unique within the page. */
export function emptyBlock(type: BlockType): PageBlock {
  const id = `b_${Math.random().toString(36).slice(2, 10)}`
  switch (type) {
    case 'heading':
      return { id, type, text: { en: '', es: '' }, level: 'h2' }
    case 'text':
      return { id, type, text: { en: '', es: '' } }
    case 'image':
      return { id, type, url: '', alt: { en: '', es: '' } }
    case 'button':
      return { id, type, label: { en: '', es: '' }, href: '/' }
    case 'quote':
      return { id, type, text: { en: '', es: '' }, attribution: { en: '', es: '' } }
    case 'divider':
      return { id, type }
  }
}

/**
 * Reads blocks off a Prisma Json column.
 *
 * Anything that does not parse is dropped rather than thrown: a page saved by an older version
 * of the editor must still render the blocks it does understand.
 */
export function parseBlocks(value: unknown): PageBlock[] {
  if (!Array.isArray(value)) return []
  const blocks: PageBlock[] = []
  for (const entry of value) {
    const parsed = blockSchema.safeParse(entry)
    if (parsed.success) blocks.push(parsed.data)
  }
  return blocks
}
