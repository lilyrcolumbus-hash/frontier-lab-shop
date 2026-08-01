import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Affiliates',
}

type Lang = 'en' | 'es'

export default async function AffiliatesPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-amber/30 text-amber mb-4">
            {lang === 'en' ? 'Coming Soon' : 'Próximamente'}
          </span>
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Affiliate Program' : 'Programa de Afiliados'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-cream-muted leading-relaxed">
          {lang === 'en'
            ? "We're building an affiliate program for creators and educators in the mycology space who want to partner with Frontier Lab. It isn't live yet, but if you're interested, email us and we'll reach out as soon as it launches with commission details."
            : 'Estamos construyendo un programa de afiliados para creadores y educadores del mundo de la micología que quieran asociarse con Frontier Lab. Todavía no está activo, pero si te interesa, escríbenos y te contactaremos apenas se lance, con los detalles de comisión.'}
        </p>

        <div className="bg-surface border border-ds-border rounded-2xl p-6 mt-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-cream-muted/50 mb-1">
            {lang === 'en' ? 'Interested? Email us' : '¿Interesado? Escríbenos'}
          </p>
          <a
            href="mailto:lyhoffllc.info@gmail.com?subject=Affiliate%20Program%20Interest"
            className="text-accent hover:underline text-lg font-body font-medium"
          >
            lyhoffllc.info@gmail.com
          </a>
        </div>
      </div>
    </div>
  )
}
