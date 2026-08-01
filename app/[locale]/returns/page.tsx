import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Returns',
}

type Lang = 'en' | 'es'

export default async function ReturnsPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Returns & Refunds' : 'Devoluciones y Reembolsos'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Living cultures & substrate (LC, grain spawn, bulk substrate, fruiting blocks)' : 'Cultivos vivos y sustrato (LC, grano, sustrato a granel, fruiting blocks)'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? 'Because these are living, perishable biological materials, we cannot accept returns once an order has shipped. If your order arrives damaged, dead, or visibly contaminated, contact us within 48 hours of delivery with photos at lyhoffllc.info@gmail.com and we will arrange a replacement or refund at our discretion.'
              : 'Debido a que son materiales biológicos vivos y perecederos, no podemos aceptar devoluciones una vez que el pedido ha sido enviado. Si tu pedido llega dañado, muerto o visiblemente contaminado, contáctanos dentro de las 48 horas posteriores a la entrega con fotos a lyhoffllc.info@gmail.com y coordinaremos un reemplazo o reembolso a nuestra discreción.'}
          </p>
        </section>

        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'Equipment & non-biological items' : 'Equipo y artículos no biológicos'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? 'Non-biological equipment (such as extraction lids and tools) may be returned unused, in original packaging, within 30 days of delivery. The buyer is responsible for return shipping unless the item was defective or incorrect.'
              : 'El equipo no biológico (como tapas de extracción y herramientas) puede devolverse sin usar, en su empaque original, dentro de 30 días de la entrega. El comprador es responsable del envío de devolución salvo que el artículo estuviera defectuoso o incorrecto.'}
          </p>
        </section>

        <section>
          <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
            {lang === 'en' ? 'How to request a replacement or refund' : 'Cómo solicitar un reemplazo o reembolso'}
          </h2>
          <p className="text-cream-muted leading-relaxed">
            {lang === 'en'
              ? 'Email lyhoffllc.info@gmail.com with your order number, a description of the issue, and photos. We aim to respond within 1–2 business days.'
              : 'Escribe a lyhoffllc.info@gmail.com con tu número de pedido, una descripción del problema y fotos. Buscamos responder dentro de 1–2 días hábiles.'}
          </p>
        </section>
      </div>
    </div>
  )
}
