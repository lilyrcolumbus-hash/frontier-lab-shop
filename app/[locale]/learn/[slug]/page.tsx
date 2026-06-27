import { notFound } from 'next/navigation'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ARTICLES_MAP, CATEGORY_LABEL, CATEGORY_COLOR, CATEGORY_GRADIENT } from '@/lib/learn-data'
import { SPECIES_MAP } from '@/lib/species-data'
import { cn } from '@/lib/utils'

interface PageProps {
  params: { locale: string; slug: string }
}

export function generateStaticParams() {
  return Object.keys(ARTICLES_MAP).map((slug) => ({ slug }))
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = params
  setRequestLocale(locale)

  const article = ARTICLES_MAP[slug]
  if (!article) notFound()

  const lang = locale as 'en' | 'es'
  const cat = CATEGORY_LABEL[article.category]
  const catColor = CATEGORY_COLOR[article.category]
  const catGradient = CATEGORY_GRADIENT[article.category]
  const relatedSpecies = article.species ? SPECIES_MAP[article.species] : null

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      {article.imageUrl ? (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title[lang]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/95 via-cream/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <span className={`inline-block font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border ${catColor} mb-3`}>
              {cat[lang]}
            </span>
            <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream-900 leading-tight">
              {article.title[lang]}
            </h1>
          </div>
        </div>
      ) : (
        <div className={`bg-gradient-to-br ${catGradient} border-b border-ds-border py-16`}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <span className={`inline-block font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border ${catColor} mb-4`}>
              {cat[lang]}
            </span>
            <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream leading-tight">
              {article.title[lang]}
            </h1>
          </div>
        </div>
      )}

      {/* Meta bar */}
      <div className="border-b border-ds-border bg-surface">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-6 text-sm text-cream-muted">
          <span>{article.readTime} min read</span>
          {relatedSpecies && (
            <>
              <span>·</span>
              <Link href={`/encyclopedia/${relatedSpecies.slug}`} className="text-accent hover:underline">
                {relatedSpecies.commonName}
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Intro */}
        <p className="text-cream-muted text-lg leading-relaxed mb-12">
          {article.intro[lang]}
        </p>

        {/* Key Takeaways */}
        <div className="bg-accent/8 border border-accent/20 rounded-2xl p-6 mb-12">
          <h2 className="font-body font-bold text-base tracking-tight text-accent mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            {lang === 'en' ? 'Key Takeaways' : 'Puntos Clave'}
          </h2>
          <ul className="space-y-2">
            {article.keyTakeaways[lang].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-cream-muted leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-shrink-0 mt-0.5 font-mono text-[10px] font-bold">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {article.sections.map((section, i) => (
            <section key={i}>
              <h2 className="font-body font-bold text-2xl tracking-tight text-cream mb-4">
                {section.title[lang]}
              </h2>
              <p className="text-cream-muted leading-relaxed">
                {section.content[lang]}
              </p>
            </section>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-16 pt-12 border-t border-ds-border flex flex-col sm:flex-row gap-4">
          {relatedSpecies && (
            <Link
              href={`/encyclopedia/${relatedSpecies.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-full font-body font-medium px-6 py-3 text-base transition-all duration-200 bg-amber text-bg shadow-glow-amber-sm hover:bg-amber-bright hover:shadow-glow-amber active:scale-95"
            >
              {lang === 'en'
                ? `Explore ${relatedSpecies.commonName} →`
                : `Explorar ${relatedSpecies.commonName} →`}
            </Link>
          )}
          <Link
            href="/learn"
            className="inline-flex items-center justify-center gap-2 rounded-full font-body font-medium px-6 py-3 text-base transition-all duration-200 border border-accent/30 hover:border-accent/60 text-accent hover:bg-accent/8 active:scale-95"
          >
            {lang === 'en' ? '← Back to Academy' : '← Volver a la Academia'}
          </Link>
        </div>
      </div>
    </div>
  )
}
