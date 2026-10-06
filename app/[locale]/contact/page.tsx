import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Contact',
}

type Lang = 'en' | 'es'

export default async function ContactPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Contact Us' : 'Contáctanos'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-cream-muted leading-relaxed mb-8">
          {lang === 'en'
            ? "Questions about an order, a product, or cultivation in general? We're happy to help."
            : '¿Preguntas sobre un pedido, un producto o cultivo en general? Con gusto te ayudamos.'}
        </p>

        <div className="bg-surface border border-ds-border rounded-none p-6 space-y-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cream-muted/50 mb-1">
              {lang === 'en' ? 'Email' : 'Correo'}
            </p>
            <a
              href="mailto:codebake.SaaS@outlook.com"
              className="text-accent hover:underline text-lg font-body font-medium"
            >
              codebake.SaaS@outlook.com
            </a>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cream-muted/50 mb-1">
              {lang === 'en' ? 'Based in' : 'Ubicados en'}
            </p>
            <p className="text-cream">Ohio, USA</p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-cream-muted/50 mb-1">
              {lang === 'en' ? 'Response time' : 'Tiempo de respuesta'}
            </p>
            <p className="text-cream">
              {lang === 'en' ? '1–2 business days' : '1–2 días hábiles'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
