import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'Terms of Service',
}

type Lang = 'en' | 'es'

const LAST_UPDATED: Record<Lang, string> = {
  en: 'July 29, 2026',
  es: '29 de julio de 2026',
}

const SECTIONS: { title: Record<Lang, string>; body: Record<Lang, string[]> }[] = [
  {
    title: { en: '1. Acceptance of Terms', es: '1. Aceptación de los Términos' },
    body: {
      en: [
        'By accessing or using this website (the "Site"), operated by Frontier Lab, a sole proprietorship based in Ohio, USA, you agree to these Terms of Service. If you do not agree, please do not use the Site.',
      ],
      es: [
        'Al acceder o usar este sitio web (el "Sitio"), operado por Frontier Lab, una empresa individual (sole proprietorship) con sede en Ohio, EE.UU., aceptas estos Términos de Servicio. Si no estás de acuerdo, no uses el Sitio.',
      ],
    },
  },
  {
    title: { en: '2. Educational Content Disclaimer', es: '2. Descargo de Responsabilidad del Contenido Educativo' },
    body: {
      en: [
        'The Encyclopedia, Learn/Academy articles, and any wellness-related content on this Site are provided for educational and informational purposes only and are not medical advice. Statements about mushroom species and their properties have not been evaluated by the FDA. Our products are not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare provider before using any wellness product, especially if you are pregnant, nursing, taking medication, or have a medical condition.',
      ],
      es: [
        'La Enciclopedia, los artículos de Aprende/Academia, y cualquier contenido relacionado con bienestar en este Sitio se ofrecen solo con fines educativos e informativos y no constituyen asesoría médica. Las afirmaciones sobre especies de hongos y sus propiedades no han sido evaluadas por la FDA. Nuestros productos no están destinados a diagnosticar, tratar, curar o prevenir ninguna enfermedad. Consulta a un profesional de la salud calificado antes de usar cualquier producto de bienestar, especialmente si estás embarazada, en periodo de lactancia, tomando medicamentos o tienes una condición médica.',
      ],
    },
  },
  {
    title: { en: '3. Products & Pricing', es: '3. Productos y Precios' },
    body: {
      en: [
        'We make reasonable efforts to describe our products accurately, but we do not guarantee that descriptions, images, or other content are error-free. Prices are listed in USD and may change without notice. We reserve the right to limit quantities or refuse any order.',
      ],
      es: [
        'Hacemos esfuerzos razonables para describir nuestros productos con precisión, pero no garantizamos que las descripciones, imágenes u otro contenido estén libres de errores. Los precios se muestran en USD y pueden cambiar sin previo aviso. Nos reservamos el derecho de limitar cantidades o rechazar cualquier pedido.',
      ],
    },
  },
  {
    title: { en: '4. Orders & Payment', es: '4. Pedidos y Pago' },
    body: {
      en: [
        'All payments are processed securely through Stripe. By placing an order, you confirm that the payment information you provide is accurate and that you are authorized to use the payment method. Orders are confirmed by email once payment is successfully processed.',
      ],
      es: [
        'Todos los pagos se procesan de forma segura a través de Stripe. Al realizar un pedido, confirmas que la información de pago que proporcionas es precisa y que estás autorizado a usar ese método de pago. Los pedidos se confirman por correo electrónico una vez que el pago se procesa exitosamente.',
      ],
    },
  },
  {
    title: { en: '5. Shipping', es: '5. Envíos' },
    body: {
      en: [
        'We currently ship to the United States, Canada, and Mexico. Standard Shipping is a flat $9.99 and takes 3–5 business days. Delivery times are estimates, not guarantees, and we are not responsible for delays caused by the carrier or customs.',
      ],
      es: [
        'Actualmente enviamos a Estados Unidos, Canadá y México. El Envío Estándar tiene una tarifa fija de $9.99 y toma de 3 a 5 días hábiles. Los tiempos de entrega son estimados, no garantizados, y no somos responsables de retrasos causados por la paquetería o aduanas.',
      ],
    },
  },
  {
    title: { en: '6. Returns & Refunds', es: '6. Devoluciones y Reembolsos' },
    body: {
      en: [
        'Because most of our products (liquid cultures, grain spawn, bulk substrate, and fruiting blocks) are living, perishable biological materials, we cannot accept returns once an order has shipped. If your order arrives damaged, dead, or visibly contaminated, contact us within 48 hours of delivery with photos at lyhoffllc.info@gmail.com and we will arrange a replacement or refund at our discretion.',
        'Non-biological equipment items (such as extraction lids and tools) may be returned unused, in original packaging, within 30 days of delivery; the buyer is responsible for return shipping unless the item was defective or incorrect.',
      ],
      es: [
        'Debido a que la mayoría de nuestros productos (cultivos líquidos, grano inoculado, sustrato a granel y bloques de fructificación) son materiales biológicos vivos y perecederos, no podemos aceptar devoluciones una vez que el pedido ha sido enviado. Si tu pedido llega dañado, muerto o visiblemente contaminado, contáctanos dentro de las 48 horas posteriores a la entrega con fotos a lyhoffllc.info@gmail.com y coordinaremos un reemplazo o reembolso a nuestra discreción.',
        'Los artículos de equipo no biológico (como tapas de extracción y herramientas) pueden devolverse sin usar, en su empaque original, dentro de 30 días de la entrega; el comprador es responsable del envío de devolución salvo que el artículo estuviera defectuoso o incorrecto.',
      ],
    },
  },
  {
    title: { en: '7. Cultivation Risk', es: '7. Riesgo de Cultivo' },
    body: {
      en: [
        'Mushroom cultivation involves inherent risks, including contamination and crop failure, that can occur after a product leaves our facility due to factors outside our control (handling, environment, sterile technique). We do not guarantee any specific yield or outcome. You are responsible for following applicable local laws regarding the cultivation and use of any species you purchase.',
      ],
      es: [
        'El cultivo de hongos implica riesgos inherentes, incluyendo contaminación y fallas en el cultivo, que pueden ocurrir después de que el producto sale de nuestras instalaciones debido a factores fuera de nuestro control (manipulación, ambiente, técnica estéril). No garantizamos ningún rendimiento o resultado específico. Eres responsable de cumplir con las leyes locales aplicables respecto al cultivo y uso de cualquier especie que compres.',
      ],
    },
  },
  {
    title: { en: '8. Intellectual Property', es: '8. Propiedad Intelectual' },
    body: {
      en: [
        'All content on the Site — including text, images, logos, and the Frontier Lab name — is owned by Frontier Lab or its licensors and may not be copied or reused without permission.',
      ],
      es: [
        'Todo el contenido del Sitio — incluyendo texto, imágenes, logos y el nombre Frontier Lab — es propiedad de Frontier Lab o sus licenciantes y no puede copiarse ni reutilizarse sin permiso.',
      ],
    },
  },
  {
    title: { en: '9. User-Generated Content', es: '9. Contenido Generado por Usuarios' },
    body: {
      en: [
        'If the Site allows you to submit content (such as forum posts, gallery photos, or grow journal entries), you retain ownership of it but grant us a license to display it on the Site. You are responsible for anything you post and must not post unlawful, infringing, or harmful content.',
      ],
      es: [
        'Si el Sitio te permite enviar contenido (como publicaciones en el foro, fotos de la galería o entradas de diario de cultivo), conservas la propiedad de ese contenido pero nos otorgas una licencia para mostrarlo en el Sitio. Eres responsable de todo lo que publiques y no debes publicar contenido ilegal, infractor o dañino.',
      ],
    },
  },
  {
    title: { en: '10. Limitation of Liability', es: '10. Limitación de Responsabilidad' },
    body: {
      en: [
        'To the fullest extent permitted by law, Frontier Lab is not liable for any indirect, incidental, or consequential damages arising from your use of the Site or our products, including crop loss or contamination after delivery.',
      ],
      es: [
        'En la máxima medida permitida por la ley, Frontier Lab no es responsable de daños indirectos, incidentales o consecuentes derivados del uso del Sitio o nuestros productos, incluyendo pérdida de cultivo o contaminación posterior a la entrega.',
      ],
    },
  },
  {
    title: { en: '11. Governing Law', es: '11. Ley Aplicable' },
    body: {
      en: [
        'These Terms are governed by the laws of the State of Ohio, USA, without regard to conflict-of-law principles.',
      ],
      es: [
        'Estos Términos se rigen por las leyes del Estado de Ohio, EE.UU., sin considerar principios de conflicto de leyes.',
      ],
    },
  },
  {
    title: { en: '12. Changes to These Terms', es: '12. Cambios a Estos Términos' },
    body: {
      en: [
        'We may update these Terms at any time. The "Last updated" date above reflects the most recent revision. Continued use of the Site after changes means you accept the updated Terms.',
      ],
      es: [
        'Podemos actualizar estos Términos en cualquier momento. La fecha de "Última actualización" arriba refleja la revisión más reciente. Si sigues usando el Sitio después de un cambio, aceptas los Términos actualizados.',
      ],
    },
  },
  {
    title: { en: '13. Contact Us', es: '13. Contáctanos' },
    body: {
      en: ['Questions about these Terms? Email us at lyhoffllc.info@gmail.com.'],
      es: ['¿Preguntas sobre estos Términos? Escríbenos a lyhoffllc.info@gmail.com.'],
    },
  },
]

export default async function TermsPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'Terms of Service' : 'Términos de Servicio'}
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
