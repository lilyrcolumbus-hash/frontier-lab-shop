import Image from 'next/image'
import { Link } from '@/navigation'
import type { PageBlock } from '@/lib/page-blocks'

/** Renders a page composed in /admin/pages. Every block type maps to fixed, safe markup. */
export function BlockRenderer({ blocks, locale }: { blocks: PageBlock[]; locale: 'en' | 'es' }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading': {
            const text = block.text[locale] || block.text.en
            if (!text) return null
            return block.level === 'h3' ? (
              <h3 key={block.id} className="font-heading font-medium text-xl text-cream tracking-tight pt-2">
                {text}
              </h3>
            ) : (
              <h2 key={block.id} className="font-heading font-medium text-2xl sm:text-3xl text-cream tracking-tight pt-4">
                {text}
              </h2>
            )
          }

          case 'text': {
            const text = block.text[locale] || block.text.en
            if (!text) return null
            // Blank lines separate paragraphs — the editor is a plain textarea, not rich text.
            return (
              <div key={block.id} className="space-y-4">
                {text.split(/\n{2,}/).map((paragraph, i) => (
                  <p key={i} className="text-cream-muted leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            )
          }

          case 'image': {
            if (!block.url) return null
            return (
              <div key={block.id} className="relative w-full aspect-[16/9] rounded-none overflow-hidden border border-ds-border">
                <Image
                  src={block.url}
                  alt={block.alt[locale] || block.alt.en || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            )
          }

          case 'button': {
            const label = block.label[locale] || block.label.en
            if (!label) return null
            const isExternal = /^https?:\/\//.test(block.href)
            return isExternal ? (
              <a
                key={block.id}
                href={block.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 rounded-full bg-accent text-surface text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                {label}
              </a>
            ) : (
              <Link
                key={block.id}
                href={block.href}
                className="inline-block px-6 py-3 rounded-full bg-accent text-surface text-sm font-semibold hover:bg-accent-hover transition-colors"
              >
                {label}
              </Link>
            )
          }

          case 'quote': {
            const text = block.text[locale] || block.text.en
            if (!text) return null
            const attribution = block.attribution[locale] || block.attribution.en
            return (
              <blockquote key={block.id} className="border-l-2 border-accent pl-5 py-1">
                <p className="text-cream text-lg leading-relaxed">{text}</p>
                {attribution && <footer className="text-sm text-cream-muted mt-2">— {attribution}</footer>}
              </blockquote>
            )
          }

          case 'divider':
            return <hr key={block.id} className="border-ds-border" />
        }
      })}
    </div>
  )
}
