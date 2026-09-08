'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { ScrollReveal, StaggerGrid } from '@/components/ui/ScrollReveal'

const PREVIEW_ARTICLES = [
  {
    slug: 'beginners-guide-oyster-mushrooms',
    category: 'For Beginners',
    badgeVariant: 'success' as const,
    title: "The Complete Beginner's Guide to Growing Oyster Mushrooms",
    readTime: 12,
    image: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png',
    accent: '#00FFB8',
  },
  {
    slug: 'understanding-mycelium',
    category: 'Mushroom Science',
    badgeVariant: 'accent' as const,
    title: 'Understanding Mycelium: The Underground Network',
    readTime: 8,
    image: 'https://drzwclnecktguodpokir.supabase.co/storage/v1/object/public/product-images/1788523252817-blue-oyster.png',
    accent: '#7C3AED',
  },
  {
    slug: 'lions-mane-cognitive-benefits',
    category: 'Health & Wellness',
    badgeVariant: 'warning' as const,
    title: "Lion's Mane & Brain Health: What the Science Actually Says",
    readTime: 15,
    image: 'https://images.unsplash.com/photo-1625286535466-68a6d71e4568?w=600',
    accent: '#FFAE00',
  },
]

export function AcademyPreview() {
  const t = useTranslations('home.academy')
  const tc = useTranslations('common')

  return (
    <section className="py-28 bg-surface relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="flex items-end justify-between mb-16">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-violet text-xs uppercase tracking-[0.2em] mb-4">
              <span className="w-4 h-px bg-violet" />
              Frontier Lab Academy
            </span>
            <h2 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight">
              {t('title')}
            </h2>
          </div>
          <Link
            href="/learn"
            className="hidden sm:flex items-center gap-2 text-sm font-mono text-accent hover:text-cream transition-colors"
          >
            {t('viewAll')} →
          </Link>
        </ScrollReveal>

        {/* Cards */}
        <StaggerGrid
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.12}
        >
          {PREVIEW_ARTICLES.map((article) => (
            <Link key={article.slug} href={`/learn/${article.slug}`} className="group">
              <div className="relative overflow-hidden rounded-none border border-ds-border bg-elevated h-full transition-all duration-500 hover:border-accent/25 hover:-translate-y-1.5">
                {/* Colored top line */}
                <div className="h-px w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-accent via-violet to-gold" />

                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/20 to-transparent" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${article.accent}08 0%, transparent 70%)` }}
                  />
                </div>

                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={article.badgeVariant} size="sm">{article.category}</Badge>
                    <span className="text-xs text-cream-muted font-mono">{article.readTime} {tc('readTime')}</span>
                  </div>
                  <h3 className="font-body text-base font-semibold text-cream leading-snug group-hover:text-accent transition-colors duration-300">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-accent font-mono mt-auto pt-2 border-t border-ds-border">
                    <span>Read article</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </StaggerGrid>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/learn" className="text-sm font-mono text-accent">{t('viewAll')} →</Link>
        </div>
      </div>
    </section>
  )
}
