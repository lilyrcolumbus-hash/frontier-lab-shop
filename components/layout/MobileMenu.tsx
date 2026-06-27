'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations()

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const shopLinks = [
    { label: t('nav.shopDropdown.kits'), href: '/shop?category=kit' },
    { label: t('nav.shopDropdown.spawn'), href: '/shop?category=spawn' },
    { label: t('nav.shopDropdown.substrates'), href: '/shop?category=substrate' },
    { label: t('nav.shopDropdown.equipment'), href: '/shop?category=equipment' },
    { label: t('nav.shopDropdown.wellness'), href: '/shop?category=wellness' },
    { label: t('nav.shopDropdown.bundles'), href: '/shop?category=bundle' },
  ]

  const learnLinks = [
    { label: t('nav.learnDropdown.beginners'), href: '/learn?category=beginners' },
    { label: t('nav.learnDropdown.indoor'), href: '/learn?category=indoor' },
    { label: t('nav.learnDropdown.outdoor'), href: '/learn?category=outdoor' },
    { label: t('nav.learnDropdown.lab'), href: '/learn?category=lab' },
    { label: t('nav.learnDropdown.science'), href: '/learn?category=science' },
  ]

  const toolLinks = [
    { label: t('nav.toolsDropdown.calculator'), href: '/tools/grow-calculator' },
    { label: t('nav.toolsDropdown.journal'), href: '/tools/grow-journal' },
    { label: t('nav.toolsDropdown.finder'), href: '/tools/species-finder' },
  ]

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-sm bg-surface z-50 transition-transform duration-300 flex flex-col overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.openMenu')}
      >
        <div className="flex items-center justify-between p-6 border-b border-ds-border">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-2 text-cream-muted hover:text-cream rounded-lg hover:bg-elevated transition-colors"
            aria-label={t('nav.closeMenu')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-6 space-y-8">
          <Section title={t('nav.shop')}>
            {shopLinks.map((l) => <NavLink key={l.href} href={l.href} onClick={onClose}>{l.label}</NavLink>)}
          </Section>

          <Section title={t('nav.learn')}>
            {learnLinks.map((l) => <NavLink key={l.href} href={l.href} onClick={onClose}>{l.label}</NavLink>)}
          </Section>

          <Section title={t('nav.tools')}>
            {toolLinks.map((l) => <NavLink key={l.href} href={l.href} onClick={onClose}>{l.label}</NavLink>)}
          </Section>

          <div className="space-y-3">
            <NavLink href="/encyclopedia" onClick={onClose} large>{t('nav.encyclopedia')}</NavLink>
            <NavLink href="/community" onClick={onClose} large>{t('nav.community')}</NavLink>
            <NavLink href="/quiz" onClick={onClose} large>Find Your Mushroom</NavLink>
          </div>
        </nav>

        <div className="p-6 border-t border-ds-border flex items-center justify-between">
          <LanguageSwitcher />
          <Link
            href="/account"
            onClick={onClose}
            className="text-sm text-cream-muted hover:text-cream transition-colors"
          >
            {t('nav.account')}
          </Link>
        </div>
      </div>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-cream-muted mb-3 font-body font-medium">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function NavLink({
  href,
  onClick,
  children,
  large,
}: {
  href: string
  onClick: () => void
  children: React.ReactNode
  large?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'block py-2 text-cream-muted hover:text-cream transition-colors font-body',
        large ? 'text-lg font-medium' : 'text-base'
      )}
    >
      {children}
    </Link>
  )
}
