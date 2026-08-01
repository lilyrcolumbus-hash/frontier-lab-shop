import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Careers',
}

type Lang = 'en' | 'es'

export default async function CareersPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Careers' : 'Empleo'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-cream-muted leading-relaxed">
          {lang === 'en'
            ? "We don't have any open positions right now — Frontier Lab is a small, hands-on team. If that changes, we'll list roles here first."
            : 'No tenemos vacantes abiertas por el momento — Frontier Lab es un equipo pequeño y práctico. Si eso cambia, publicaremos los puestos aquí primero.'}
        </p>
        <p className="text-cream-muted leading-relaxed mt-4">
          {lang === 'en'
            ? 'Want to reach out anyway? Email us at lyhoffllc.info@gmail.com.'
            : '¿Quieres escribirnos de todas formas? Contáctanos a lyhoffllc.info@gmail.com.'}
        </p>
      </div>
    </div>
  )
}
