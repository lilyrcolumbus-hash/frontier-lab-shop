import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Shipping',
}

type Lang = 'en' | 'es'

export default async function ShippingPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Shipping' : 'Envíos'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Where we ship' : 'A dónde enviamos'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? 'We currently ship to the United States, Canada, and Mexico.'
              : 'Actualmente enviamos a Estados Unidos, Canadá y México.'}
          </p>
        </section>

        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Rates & delivery time' : 'Tarifas y tiempo de entrega'}
          </h2>
          <div className="bg-surface border border-ds-border rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="font-body font-bold text-cream">
                {lang === 'en' ? 'Standard Shipping' : 'Envío Estándar'}
              </p>
              <p className="text-cream-muted text-sm mt-1">
                {lang === 'en' ? '3–5 business days' : '3–5 días hábiles'}
              </p>
            </div>
            <p className="font-body font-bold text-accent text-lg">$9.99</p>
          </div>
          <p className="text-cream-muted leading-relaxed mt-4 text-sm">
            {lang === 'en'
              ? 'Delivery times are estimates, not guarantees, and we are not responsible for delays caused by the carrier or customs.'
              : 'Los tiempos de entrega son estimados, no garantizados, y no somos responsables de retrasos causados por la paquetería o aduanas.'}
          </p>
        </section>

        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Order processing' : 'Procesamiento del pedido'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? "Orders are packed and handed to the carrier within 1–2 business days of purchase. You'll get a confirmation email right after checkout, and a shipping notice once your order is on its way."
              : 'Los pedidos se empacan y se entregan a la paquetería dentro de 1–2 días hábiles tras la compra. Recibirás un email de confirmación justo después de pagar, y un aviso de envío cuando tu pedido esté en camino.'}
          </p>
        </section>

        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Shipping live cultures' : 'Envío de cultivos vivos'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? "Liquid culture syringes, grain spawn, and other living products are packed to survive transit, but they're perishable. Refrigerate liquid culture on arrival and use it as soon as you reasonably can."
              : 'Las jeringas de cultivo líquido, el grano inoculado y otros productos vivos se empacan para sobrevivir el envío, pero son perecederos. Refrigera el cultivo líquido al recibirlo y úsalo lo antes posible.'}
          </p>
        </section>
      </div>
    </div>
  )
}
