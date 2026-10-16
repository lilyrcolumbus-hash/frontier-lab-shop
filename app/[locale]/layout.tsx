import { isStripeTestMode } from '@/lib/stripe-mode'
import { IS_DEMO, DEMO_BANNER_HEIGHT } from '@/lib/site-mode'
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
            {IS_DEMO && (
              // One slim line in the site's paper, ink and gold style. Its height is fixed because the header
              // is `fixed` and sits just below it (see Header.tsx), so the two can never overlap.
              <div
                style={{ height: DEMO_BANNER_HEIGHT }}
                className="relative z-20 flex items-center justify-center gap-2 border-b border-ds-border bg-surface px-4 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-cream-muted"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-amber" />
                <span className="truncate">
                  <span className="md:hidden">
                    {testPayments
                      ? es ? 'Demo · pagos de prueba' : 'Demo · test payments'
                      : es ? 'Demo · pago desactivado' : 'Demo · checkout disabled'}
                  </span>
                  <span className="hidden md:inline">
                    {testPayments
                      ? es
                        ? 'Proyecto de portafolio — pagos de PRUEBA, no se cobra nada · tarjeta 4242 4242 4242 4242'
                        : 'Portfolio demo project — TEST payments, nothing is charged · test card 4242 4242 4242 4242'
                      : es
                        ? 'Proyecto de portafolio — el pago está desactivado, no se procesan pedidos reales'
                        : 'Portfolio demo project — checkout is disabled, no real orders are processed'}
                  </span>
                </span>
              </div>
            )}
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
