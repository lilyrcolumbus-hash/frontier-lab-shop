import { isStripeTestMode } from '@/lib/stripe-mode'
import type { Metadata } from 'next'
import { StoreTheme } from '@/components/StoreTheme'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GlowCursor } from '@/components/ui/GlowCursor'
import { PageTransition } from '@/components/ui/PageTransition'
import { SmoothScroll } from '@/components/ui/SmoothScroll'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    alternates: {
      languages: {
        en: '/',
        es: '/es',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as Locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()
  const testPayments = isStripeTestMode()
  const es = locale === 'es'

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StoreTheme />
      <AuthProvider>
        <SmoothScroll>
          <GlowCursor />
          <PageTransition />
          <div className="flex flex-col min-h-screen">
            <div className="bg-cream text-bg text-center text-xs sm:text-sm py-2 px-4 relative z-50">
              {testPayments
                ? es
                  ? 'Proyecto de portafolio — los pagos son de PRUEBA, no se cobra nada. Tarjeta de prueba: 4242 4242 4242 4242, cualquier fecha futura y cualquier CVC.'
                  : 'Portfolio demo project — payments run in TEST mode, nothing is charged. Test card: 4242 4242 4242 4242, any future date, any CVC.'
                : es
                  ? 'Proyecto de portafolio — el pago está desactivado, no se procesan pedidos reales.'
                  : 'Portfolio demo project — checkout is disabled, no real orders are processed.'}
            </div>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
