import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Press',
}

type Lang = 'en' | 'es'

export default async function PressPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Press' : 'Prensa'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-cream-muted leading-relaxed">
          {lang === 'en'
            ? 'Frontier Lab is a mushroom cultivation and education platform — grow kits, spawn, and a deep library of grow guides, built with a precision-facility, lab-verified approach to genetics and process.'
            : 'Frontier Lab es una plataforma de cultivo y educación sobre hongos — kits de cultivo, grano, y una biblioteca profunda de guías de cultivo, con un enfoque de instalación de precisión y genética verificada en laboratorio.'}
        </p>
        <p className="text-cream-muted leading-relaxed mt-4">
          {lang === 'en'
            ? 'For interviews, product samples, or media inquiries, email us at codebake.SaaS@outlook.com.'
            : 'Para entrevistas, muestras de producto o consultas de prensa, escríbenos a codebake.SaaS@outlook.com.'}
        </p>
      </div>
    </div>
  )
}
