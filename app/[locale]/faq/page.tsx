import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'FAQ',
}

type Lang = 'en' | 'es'

const FAQS: { q: Record<Lang, string>; a: Record<Lang, string> }[] = [
  {
    q: { en: 'How long does shipping take?', es: '¿Cuánto tarda el envío?' },
    a: {
      en: 'Standard Shipping is a flat $9.99 and arrives in 3–5 business days. We currently ship to the United States, Canada, and Mexico. See our Shipping page for details.',
      es: 'El Envío Estándar tiene una tarifa fija de $9.99 y llega en 3–5 días hábiles. Actualmente enviamos a Estados Unidos, Canadá y México. Ve la página de Envíos para más detalles.',
    },
  },
  {
    q: { en: 'Can I return a liquid culture syringe or grain spawn if I change my mind?', es: '¿Puedo devolver una jeringa de cultivo líquido o grano inoculado si cambio de opinión?' },
    a: {
      en: 'No — because these are living, perishable biological products, we can\'t accept returns once an order has shipped. If your order arrives damaged, dead, or contaminated, contact us within 48 hours with photos and we\'ll make it right. See our Returns page for the full policy.',
      es: 'No — al ser productos biológicos vivos y perecederos, no podemos aceptar devoluciones una vez enviado el pedido. Si tu pedido llega dañado, muerto o contaminado, contáctanos dentro de las 48 horas con fotos y lo solucionamos. Ve la página de Devoluciones para la política completa.',
    },
  },
  {
    q: { en: 'Is payment on this site secure?', es: '¿Es seguro pagar en este sitio?' },
    a: {
      en: 'Yes. All payments are processed by Stripe — we never see or store your card number.',
      es: 'Sí. Todos los pagos son procesados por Stripe — nunca vemos ni almacenamos el número de tu tarjeta.',
    },
  },
  {
    q: { en: "I'm new to mushroom cultivation — where should I start?", es: 'Soy nuevo en el cultivo de hongos — ¿por dónde empiezo?' },
    a: {
      en: 'Check out the Learn section for beginner guides, and the Species Finder tool to match a species to your experience level and setup.',
      es: 'Revisa la sección Aprende para guías de principiante, y la herramienta de Buscador de Especies para encontrar la especie ideal según tu experiencia y equipo.',
    },
  },
  {
    q: { en: "My culture or spawn arrived contaminated — what do I do?", es: 'Mi cultivo o grano llegó contaminado — ¿qué hago?' },
    a: {
      en: 'Email us at lyhoffllc.info@gmail.com within 48 hours of delivery with photos of the contamination and we\'ll arrange a replacement or refund.',
      es: 'Escríbenos a lyhoffllc.info@gmail.com dentro de las 48 horas de la entrega con fotos de la contaminación y coordinamos un reemplazo o reembolso.',
    },
  },
  {
    q: { en: 'Do you ship internationally?', es: '¿Envían internacionalmente?' },
    a: {
      en: 'Not yet — we currently ship to the United States, Canada, and Mexico only.',
      es: 'Todavía no — por ahora solo enviamos a Estados Unidos, Canadá y México.',
    },
  },
  {
    q: { en: "How do I track my order?", es: '¿Cómo rastreo mi pedido?' },
    a: {
      en: 'See our Track Order page — tracking details are sent to your email once your order ships.',
      es: 'Ve la página de Rastrear Pedido — los detalles de rastreo se envían a tu correo cuando tu pedido es despachado.',
    },
  },
  {
    q: { en: "Still have a question?", es: '¿Tienes otra pregunta?' },
    a: {
      en: 'Reach us any time at lyhoffllc.info@gmail.com.',
      es: 'Escríbenos cuando quieras a lyhoffllc.info@gmail.com.',
    },
  },
]

export default async function FaqPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Frequently Asked Questions' : 'Preguntas Frecuentes'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {FAQS.map((item, i) => (
          <div key={i}>
            <h2 className="font-body font-bold text-lg tracking-tight text-cream mb-2">
              {item.q[lang]}
            </h2>
            <p className="text-cream-muted leading-relaxed">{item.a[lang]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
