import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Track Order',
}

type Lang = 'en' | 'es'

export default async function TrackPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-heading font-medium text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Track Your Order' : 'Rastrea Tu Pedido'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <section>
          <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Check your email' : 'Revisa tu correo'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? "You'll get an order confirmation right after checkout, and a separate shipping email with tracking details once your order leaves our facility (within 1–2 business days of purchase). If you don't see it, check your spam folder."
              : 'Recibirás una confirmación de pedido justo después de pagar, y un correo de envío por separado con los detalles de rastreo cuando tu pedido salga de nuestras instalaciones (dentro de 1–2 días hábiles tras la compra). Si no lo ves, revisa la carpeta de spam.'}
          </p>
        </section>

        <section>
          <h2 className="font-heading font-medium text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? "Still can't find it?" : '¿Aún no lo encuentras?'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? 'Email us at lyhoffllc.info@gmail.com with your order number (from your confirmation email) and we\'ll look it up for you.'
              : 'Escríbenos a lyhoffllc.info@gmail.com con tu número de pedido (del correo de confirmación) y lo buscamos por ti.'}
          </p>
        </section>
      </div>
    </div>
  )
}
