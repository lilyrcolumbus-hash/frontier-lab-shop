import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Privacy Policy',
}

type Lang = 'en' | 'es'

const LAST_UPDATED: Record<Lang, string> = {
  en: 'July 29, 2026',
  es: '29 de julio de 2026',
}

const SECTIONS: { title: Record<Lang, string>; body: Record<Lang, string[]> }[] = [
  {
    title: { en: '1. Who We Are', es: '1. Quiénes Somos' },
    body: {
      en: [
        'Frontier Lab ("Frontier Lab", "we", "us") is a sole proprietorship based in Ohio, USA, operating this website (the "Site") to sell mushroom cultivation products and provide educational content. This Privacy Policy explains what personal information we collect, how we use it, and your choices. By using the Site, you agree to the practices described here.',
      ],
      es: [
        'Frontier Lab ("Frontier Lab", "nosotros") es una empresa individual (sole proprietorship) con sede en Ohio, EE.UU., que opera este sitio web (el "Sitio") para vender productos de cultivo de hongos y ofrecer contenido educativo. Esta Política de Privacidad explica qué información personal recopilamos, cómo la usamos y qué opciones tienes. Al usar el Sitio, aceptas las prácticas descritas aquí.',
      ],
    },
  },
  {
    title: { en: '2. Information We Collect', es: '2. Información Que Recopilamos' },
    body: {
      en: [
        'Order information: name, shipping address, email address, and phone number (if provided) when you place an order.',
        'Payment information: we do not store your card details. Payments are processed directly by Stripe, our payment processor, under its own privacy and security practices.',
        'Account information: if you create an account, we store your name, email, and any grow journal entries or wishlist items you add.',
        'Communications: your email address if you subscribe to our newsletter or contact us directly.',
        "Usage data: pages visited, cart contents (stored locally in your browser), and general technical data collected automatically when you use the Site.",
      ],
      es: [
        'Información del pedido: nombre, dirección de envío, correo electrónico y teléfono (si lo proporcionas) al hacer un pedido.',
        'Información de pago: no almacenamos los datos de tu tarjeta. Los pagos son procesados directamente por Stripe, nuestro procesador de pagos, bajo sus propias políticas de privacidad y seguridad.',
        'Información de cuenta: si creas una cuenta, guardamos tu nombre, correo electrónico y cualquier entrada de diario de cultivo o lista de deseos que agregues.',
        'Comunicaciones: tu correo electrónico si te suscribes a nuestro boletín o nos contactas directamente.',
        'Datos de uso: páginas visitadas, contenido del carrito (guardado localmente en tu navegador) y datos técnicos generales recopilados automáticamente al usar el Sitio.',
      ],
    },
  },
  {
    title: { en: '3. How We Use Your Information', es: '3. Cómo Usamos Tu Información' },
    body: {
      en: [
        "We use your information to process and ship your orders, communicate with you about your order status, respond to support requests, send marketing emails if you've opted in (you can unsubscribe at any time), and improve the Site's content and performance.",
      ],
      es: [
        'Usamos tu información para procesar y enviar tus pedidos, comunicarnos contigo sobre el estado de tu pedido, responder a solicitudes de soporte, enviarte correos de marketing si diste tu consentimiento (puedes darte de baja en cualquier momento), y mejorar el contenido y desempeño del Sitio.',
      ],
    },
  },
  {
    title: { en: '4. Third-Party Services', es: '4. Servicios de Terceros' },
    body: {
      en: [
        'We share data only as needed to operate the Site: Stripe processes all payments and we never see or store your full card number. Supabase hosts our order and account database. Vercel hosts the Site and may collect basic technical data (IP address, browser type) for performance and security. We do not sell your personal information to third parties.',
      ],
      es: [
        'Compartimos datos solo lo necesario para operar el Sitio: Stripe procesa todos los pagos y nunca vemos ni almacenamos el número completo de tu tarjeta. Supabase aloja nuestra base de datos de pedidos y cuentas. Vercel aloja el Sitio y puede recopilar datos técnicos básicos (dirección IP, tipo de navegador) por rendimiento y seguridad. No vendemos tu información personal a terceros.',
      ],
    },
  },
  {
    title: { en: '5. Cookies & Local Storage', es: '5. Cookies y Almacenamiento Local' },
    body: {
      en: [
        "The Site uses your browser's local storage to remember your cart contents and language preference. These are not third-party advertising cookies — they exist only to make the Site work correctly for you.",
      ],
      es: [
        'El Sitio usa el almacenamiento local de tu navegador para recordar el contenido de tu carrito y tu preferencia de idioma. No son cookies de publicidad de terceros — existen solo para que el Sitio funcione correctamente para ti.',
      ],
    },
  },
  {
    title: { en: '6. Data Retention & Security', es: '6. Retención de Datos y Seguridad' },
    body: {
      en: [
        'We retain order and account information for as long as needed to comply with tax and accounting obligations, and delete it upon request where not legally required to keep it. We take reasonable technical measures to protect your data, but no online system is 100% secure.',
      ],
      es: [
        'Conservamos la información de pedidos y cuentas el tiempo necesario para cumplir con obligaciones fiscales y contables, y la eliminamos a solicitud cuando no estemos legalmente obligados a conservarla. Tomamos medidas técnicas razonables para proteger tus datos, pero ningún sistema en línea es 100% seguro.',
      ],
    },
  },
  {
    title: { en: '7. Your Rights', es: '7. Tus Derechos' },
    body: {
      en: [
        'You can request access to, correction of, or deletion of your personal information at any time by contacting us at lyhoffllc.info@gmail.com. You can unsubscribe from marketing emails using the link in any email we send.',
      ],
      es: [
        'Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento escribiéndonos a lyhoffllc.info@gmail.com. Puedes darte de baja de los correos de marketing usando el enlace en cualquier correo que te enviemos.',
      ],
    },
  },
  {
    title: { en: "8. Children's Privacy", es: '8. Privacidad de Menores' },
    body: {
      en: [
        'The Site is not directed at children under 18, and we do not knowingly collect personal information from anyone under that age.',
      ],
      es: [
        'El Sitio no está dirigido a menores de 18 años, y no recopilamos a sabiendas información personal de nadie menor de esa edad.',
      ],
    },
  },
  {
    title: { en: '9. Changes to This Policy', es: '9. Cambios a Esta Política' },
    body: {
      en: [
        'We may update this Privacy Policy from time to time. The "Last updated" date at the top reflects the most recent revision. Continued use of the Site after changes means you accept the updated policy.',
      ],
      es: [
        'Podemos actualizar esta Política de Privacidad ocasionalmente. La fecha de "Última actualización" en la parte superior refleja la revisión más reciente. Si sigues usando el Sitio después de un cambio, aceptas la política actualizada.',
      ],
    },
  },
  {
    title: { en: '10. Contact Us', es: '10. Contáctanos' },
    body: {
      en: ['Questions about this Privacy Policy? Email us at lyhoffllc.info@gmail.com.'],
      es: ['¿Preguntas sobre esta Política de Privacidad? Escríbenos a lyhoffllc.info@gmail.com.'],
    },
  },
]

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Privacy Policy' : 'Política de Privacidad'}
          </h1>
          <p className="mt-3 text-sm text-cream-muted">
            {lang === 'en' ? 'Last updated: ' : 'Última actualización: '}
            {LAST_UPDATED[lang]}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {SECTIONS.map((section, i) => (
          <section key={i}>
            <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
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
    </div>
  )
}
