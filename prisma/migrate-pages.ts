/**
 * One-off (re-runnable) migration: moves the copy that lived inside the legal page components
 * into editable Page records, so /admin/pages can change it without a code change.
 *
 * The text is read straight out of the existing .tsx modules rather than retyped, so nothing is
 * paraphrased or lost in the move.
 */
import { PrismaClient } from '@prisma/client'
import { emptyBlock, type PageBlock } from '../lib/page-blocks'
import { PRIVACY_SECTIONS, TERMS_SECTIONS, type LegalSection } from '../lib/legal-content'

const prisma = new PrismaClient()

const SOURCES: { slug: string; titleEn: string; titleEs: string; sections: LegalSection[] }[] = [
  { slug: 'privacy', titleEn: 'Privacy Policy', titleEs: 'Política de Privacidad', sections: PRIVACY_SECTIONS },
  { slug: 'terms', titleEn: 'Terms of Service', titleEs: 'Términos del Servicio', sections: TERMS_SECTIONS },
]

function toBlocks(sections: LegalSection[]): PageBlock[] {
  const blocks: PageBlock[] = []
  for (const section of sections) {
    const heading = emptyBlock('heading')
    if (heading.type === 'heading') {
      heading.text = { en: section.title.en, es: section.title.es }
      blocks.push(heading)
    }
    const text = emptyBlock('text')
    if (text.type === 'text') {
      // Paragraphs are separated by a blank line, which is what the renderer splits on.
      text.text = { en: section.body.en.join('\n\n'), es: section.body.es.join('\n\n') }
      blocks.push(text)
    }
  }
  return blocks
}

async function main() {
  const store = await prisma.store.findFirstOrThrow()

  for (const source of SOURCES) {
    const blocks = toBlocks(source.sections)
    await prisma.page.upsert({
      where: { storeId_slug: { storeId: store.id, slug: source.slug } },
      update: { titleEn: source.titleEn, titleEs: source.titleEs, blocks: blocks as never },
      create: {
        storeId: store.id,
        slug: source.slug,
        titleEn: source.titleEn,
        titleEs: source.titleEs,
        blocks: blocks as never,
        status: 'active',
        showInFooter: true,
      },
    })
    console.log(`${source.slug}: ${blocks.length} blocks`)
  }

  await prisma.$disconnect()
}

main()
