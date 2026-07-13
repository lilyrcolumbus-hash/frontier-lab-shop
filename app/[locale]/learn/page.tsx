import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ARTICLES, CATEGORY_LABEL, CATEGORY_COLOR, type LearnCategory } from '@/lib/learn-data'

interface PageProps {
  params: { locale: string }
}

const BADGE_VARIANT: Record<LearnCategory, 'accent' | 'moss' | 'success' | 'warning' | 'default'> = {
  beginners:   'success',
  science:     'accent',
  cultivation: 'moss',
  wellness:    'warning',
  kitchen:     'warning',
}

export default async function LearnPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as 'en' | 'es'

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
          Frontier Lab Academy
        </p>
        <h1 className="font-body font-bold text-4xl sm:text-5xl tracking-tight text-cream mb-4">
          {lang === 'en' ? 'The Science of Cultivation' : 'La Ciencia del Cultivo'}
        </h1>
        <p className="text-cream-muted text-lg max-w-xl mx-auto">
          {lang === 'en'
            ? 'Expert guides written by cultivators, for cultivators.'
            : 'Guías expertas escritas por cultivadores, para cultivadores.'}
        </p>
      </div>

      {/* Filter pills — static for now */}
      <div className="border-b border-ds-border bg-surface sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(['beginners', 'science', 'cultivation', 'wellness', 'kitchen'] as LearnCategory[]).map((cat) => (
            <span
              key={cat}
              className={`flex-shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${CATEGORY_COLOR[cat]}`}
            >
              {CATEGORY_LABEL[cat][lang]}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-cream-muted text-sm mb-8">
          {lang === 'en'
            ? `${ARTICLES.length} guides`
            : `${ARTICLES.length} guías`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <Link key={article.slug} href={`/learn/${article.slug}`}>
              <Card hover className="overflow-hidden h-full flex flex-col group">
                {/* Image or gradient placeholder */}
                <div className="relative h-44 overflow-hidden flex-shrink-0 flex-none">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title[lang]}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${
                      article.category === 'science'     ? 'from-lavender/20 to-lavender/5' :
                      article.category === 'cultivation' ? 'from-moss/20 to-moss/5' :
                      article.category === 'wellness'    ? 'from-amber/20 to-amber/5' :
                      article.category === 'kitchen'     ? 'from-amber/20 to-amber/5' :
                      'from-accent/20 to-accent/5'
                    } flex items-center justify-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-cream-muted/25">
                        <path d="M32 8C18 8 8 18 8 28c0 4 4 6 8 6h5l-2 18h26l-2-18h5c4 0 8-2 8-6C56 18 46 8 32 8z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant={BADGE_VARIANT[article.category]} size="sm">
                      {CATEGORY_LABEL[article.category][lang]}
                    </Badge>
                    <span className="text-xs text-cream-muted">
                      {article.readTime} {lang === 'en' ? 'min read' : 'min'}
                    </span>
                  </div>
                  <h2 className="font-body font-semibold text-lg text-cream leading-snug group-hover:text-accent transition-colors">
                    {article.title[lang]}
                  </h2>
                  <p className="text-sm text-cream-muted leading-relaxed line-clamp-2 flex-1">
                    {article.excerpt[lang]}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
