import type { Metadata } from 'next'
import { Bebas_Neue, Playfair_Display, Inter, Cormorant_Garamond, Space_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
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
  metadataBase: new URL('https://shrooms.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Frontier Lab',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${playfairDisplay.variable} ${inter.variable} ${cormorantGaramond.variable} ${spaceMono.variable}`}
    >
      <body className="bg-bg text-cream font-body antialiased">{children}</body>
    </html>
  )
}
