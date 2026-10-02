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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <StoreTheme />
      <AuthProvider>
        <SmoothScroll>
          <GlowCursor />
          <PageTransition />
          <div className="flex flex-col min-h-screen">
            <div className="bg-cream text-bg text-center text-xs sm:text-sm py-2 px-4 relative z-50">
              Portfolio demo project — checkout is disabled, no real orders are processed.
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
