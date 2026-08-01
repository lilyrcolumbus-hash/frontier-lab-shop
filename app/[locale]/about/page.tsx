import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: { locale: string }
}

export const metadata = {
  title: 'About',
}

type Lang = 'en' | 'es'

const SECTIONS: { title: Record<Lang, string>; body: Record<Lang, string> }[] = [
  {
    title: { en: 'Wild Genetics. Lab Verified.', es: 'Genética Silvestre. Verificado en Laboratorio.' },
    body: {
      en: "Frontier Lab started with a simple frustration: most mushroom genetics sold online are inconsistent, and most grow instructions are written for someone who's already an expert. We set out to build a cultivation facility run with the same discipline as a lab — sealed, humidity-controlled grow rooms, sterile technique at every transfer, and equipment built for precision — so that what ships is exactly what we say it is.",
      es: 'Frontier Lab nació de una frustración simple: la mayoría de la genética de hongos que se vende en línea es inconsistente, y la mayoría de las instrucciones de cultivo están escritas para alguien que ya es experto. Nos propusimos construir una instalación de cultivo operada con la misma disciplina de un laboratorio — cuartos de cultivo sellados y con control de humedad, técnica estéril en cada transferencia, y equipo pensado para la precisión — para que lo que enviamos sea exactamente lo que decimos que es.',
    },
  },
  {
    title: { en: 'How we work', es: 'Cómo trabajamos' },
    body: {
      en: "Every liquid culture, spawn bag, and substrate block that leaves Frontier Lab passes through the same controlled environment and sterile handling we'd want if we were the ones buying it. We're outfitted with lab-grade tools for culture work — from clean-air transfers to sealed incubation — and we hold every batch to that standard before it ships.",
      es: 'Cada cultivo líquido, bolsa de grano y bloque de sustrato que sale de Frontier Lab pasa por el mismo ambiente controlado y manejo estéril que nosotros mismos querríamos si fuéramos los compradores. Contamos con herramientas de nivel laboratorio para el trabajo de cultivo — desde transferencias en aire limpio hasta incubación sellada — y sometemos cada lote a ese estándar antes de enviarlo.',
    },
  },
  {
    title: { en: "Who it's for", es: 'Para quién es' },
    body: {
      en: "From your first grow kit to advanced strain work, Frontier Lab is built for the full range of the mycology community — with an Encyclopedia, a Learn library, and hands-on grow tools alongside the catalog, so the products come with the knowledge to actually use them well.",
      es: 'Desde tu primer kit de cultivo hasta el trabajo avanzado con cepas, Frontier Lab está pensado para toda la comunidad de micología — con una Enciclopedia, una biblioteca de Aprendizaje, y herramientas prácticas de cultivo junto al catálogo, para que los productos vengan acompañados del conocimiento para usarlos bien.',
    },
  },
  {
    title: { en: 'Get in touch', es: 'Contáctanos' },
    body: {
      en: 'Questions about a product, an order, or what we do? Email us at lyhoffllc.info@gmail.com.',
      es: '¿Preguntas sobre un producto, un pedido, o lo que hacemos? Escríbenos a lyhoffllc.info@gmail.com.',
    },
  },
]

export default async function AboutPage({ params }: PageProps) {
  const { locale } = params
  setRequestLocale(locale)
  const lang = locale as Lang

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-ds-border bg-surface py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="font-body font-bold text-3xl sm:text-4xl tracking-tight text-cream">
            {lang === 'en' ? 'About Frontier Lab' : 'Sobre Frontier Lab'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {SECTIONS.map((section, i) => (
          <section key={i}>
            <h2 className="font-body font-bold text-xl tracking-tight text-cream mb-4">
              {section.title[lang]}
            </h2>
            <p className="text-cream-muted leading-relaxed">{section.body[lang]}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
