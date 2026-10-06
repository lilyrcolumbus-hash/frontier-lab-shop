/**
 * The legal copy this site shipped with.
 *
 * Kept as the fallback for /privacy and /terms: those routes render the version edited in
 * /admin/pages when one exists, and this when it does not, so the pages can never come up blank.
 * prisma/migrate-pages.ts seeds the editable copies from here.
 */

export type Lang = 'en' | 'es'

export interface LegalSection {
  title: Record<Lang, string>
  body: Record<Lang, string[]>
}

export const PRIVACY_SECTIONS: LegalSection[] = [
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
        'You can request access to, correction of, or deletion of your personal information at any time by contacting us at codebake.SaaS@outlook.com. You can unsubscribe from marketing emails using the link in any email we send.',
      ],
      es: [
        'Puedes solicitar acceso, corrección o eliminación de tu información personal en cualquier momento escribiéndonos a codebake.SaaS@outlook.com. Puedes darte de baja de los correos de marketing usando el enlace en cualquier correo que te enviemos.',
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
      en: ['Questions about this Privacy Policy? Email us at codebake.SaaS@outlook.com.'],
      es: ['¿Preguntas sobre esta Política de Privacidad? Escríbenos a codebake.SaaS@outlook.com.'],
    },
  },
]

export const TERMS_SECTIONS: LegalSection[] = [
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
        'Because most of our products (liquid cultures, grain spawn, bulk substrate, and fruiting blocks) are living, perishable biological materials, we cannot accept returns once an order has shipped. If your order arrives damaged, dead, or visibly contaminated, contact us within 48 hours of delivery with photos at codebake.SaaS@outlook.com and we will arrange a replacement or refund at our discretion.',
        'Non-biological equipment items (such as extraction lids and tools) may be returned unused, in original packaging, within 30 days of delivery; the buyer is responsible for return shipping unless the item was defective or incorrect.',
      ],
      es: [
        'Debido a que la mayoría de nuestros productos (cultivos líquidos, grano inoculado, sustrato a granel y bloques de fructificación) son materiales biológicos vivos y perecederos, no podemos aceptar devoluciones una vez que el pedido ha sido enviado. Si tu pedido llega dañado, muerto o visiblemente contaminado, contáctanos dentro de las 48 horas posteriores a la entrega con fotos a codebake.SaaS@outlook.com y coordinaremos un reemplazo o reembolso a nuestra discreción.',
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
      en: ['Questions about these Terms? Email us at codebake.SaaS@outlook.com.'],
      es: ['¿Preguntas sobre estos Términos? Escríbenos a codebake.SaaS@outlook.com.'],
    },
  },
]
