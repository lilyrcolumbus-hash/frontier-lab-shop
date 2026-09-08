import { setRequestLocale } from 'next-intl/server'
import { ReviewForm } from '@/components/review/ReviewForm'

interface PageProps {
  params: { locale: string }
  searchParams: { product?: string }
}

export const metadata = {
  title: 'Leave a Review',
}

type Lang = 'en' | 'es'

export default async function ReviewPage({ params, searchParams }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <span className="inline-block font-mono text-[10px] uppercase tracking-[0.25em] px-3 py-1 rounded-none border border-amber/30 text-amber mb-4">
            {lang === 'en' ? '15% Off Your Next Order' : '15% de Descuento en tu Próximo Pedido'}
          </span>
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Leave a Review' : 'Deja tu Reseña'}
          </h1>
          <p className="mt-3 text-cream-muted leading-relaxed">
            {lang === 'en'
              ? "Tell us about your grow — we'll unlock your 15% discount code as soon as you submit it."
              : 'Cuéntanos sobre tu cultivo — desbloqueamos tu código de 15% de descuento apenas la envíes.'}
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <ReviewForm locale={lang} initialProduct={searchParams.product} />
      </div>
    </div>
  )
}
