import { setRequestLocale } from 'next-intl/server'
import { getPage } from '@/lib/pages'
import { TERMS_SECTIONS, type Lang } from '@/lib/legal-content'
import { BlockRenderer } from '@/components/pages/BlockRenderer'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Terms of Service',
}

const LAST_UPDATED: Record<Lang, string> = {
  en: 'July 29, 2026',
  es: '29 de julio de 2026',
}


export default async function LegalPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  // Prefer the version edited in /admin/pages; the copy below stays as the fallback so the page
  // can never come up blank while the two live side by side.
  const page = await getPage('terms', locale)

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
            {page?.title ?? (lang === 'en' ? 'Terms of Service' : 'Términos del Servicio')}
          </h1>
          <p className="mt-3 text-sm text-cream-muted">
            {lang === 'en' ? 'Last updated: ' : 'Última actualización: '}
            {LAST_UPDATED[lang]}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {page ? (
          <BlockRenderer blocks={page.blocks} locale={lang} />
        ) : (
          <div className="space-y-12">
            {TERMS_SECTIONS.map((section, i) => (
              <section key={i}>
                <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
                  {section.title[lang]}
                </h2>
                <div className="space-y-3">
                  {section.body[lang].map((paragraph, j) => (
                    <p key={j} className="text-cream-muted leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
