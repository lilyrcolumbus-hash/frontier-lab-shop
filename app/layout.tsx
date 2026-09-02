import type { Metadata } from 'next'
import { Bebas_Neue, Playfair_Display, Inter, Cormorant_Garamond, Space_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { SITE_URL } from '@/lib/site-url'
import { getStoreThemeCss } from '@/lib/store-theme'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorantGaramond = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Frontier Lab — Wild Genetics. Lab Verified.',
    template: '%s | Frontier Lab',
  },
  description:
    "The world's most complete mushroom platform. Cultivate, learn, and connect. Premium grow kits, spawn, and the deepest mushroom encyclopedia online.",
  keywords: ['mushroom grow kits', 'spawn', 'mycology', 'mushroom cultivation', 'lion\'s mane', 'oyster mushrooms'],
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Frontier Lab',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const themeCss = await getStoreThemeCss()

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${playfairDisplay.variable} ${inter.variable} ${cormorantGaramond.variable} ${spaceMono.variable}`}
    >
      <body className="bg-bg text-cream font-body antialiased">
        {/* Rendered only when the store has customised its palette — the shipped defaults live
            in globals.css. Next hoists a style tag, and :root variables apply document-wide
            wherever it lands, so no manual <head> is needed: adding one puts a stray text node
            in the document head and breaks hydration on every page. */}
        {themeCss ? <style dangerouslySetInnerHTML={{ __html: themeCss }} /> : null}
        {children}
      </body>
    </html>
  )
}
