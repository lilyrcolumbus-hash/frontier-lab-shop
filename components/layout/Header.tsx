'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MobileMenu } from './MobileMenu'
import { cn } from '@/lib/utils'

interface DropdownItem {
  label: string
  href: string
  description?: string
}

interface NavDropdownProps {
  label: string
  items: DropdownItem[]
  footer?: { label: string; href: string }
}

function NavDropdown({ label, items, footer }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 text-sm font-body font-medium text-cream-muted hover:text-accent transition-colors py-2"
        aria-expanded={open}
      >
        {label}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 pt-2 z-50 min-w-[260px]">
          <div className="glass-strong border border-accent/10 rounded-2xl shadow-card overflow-hidden animate-fade-in">
            <div className="p-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex flex-col px-4 py-3 rounded-xl hover:bg-accent/8 transition-colors group"
                >
                  <span className="text-sm font-medium text-cream-muted group-hover:text-accent transition-colors">
                    {item.label}
                  </span>
                  {item.description && (
                    <span className="text-xs text-cream-muted/60 mt-0.5">{item.description}</span>
                  )}
                </Link>
              ))}
            </div>
            {footer && (
              <div className="border-t border-ds-border px-4 py-3">
                <Link
                  href={footer.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
                >
                  {footer.label}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const t = useTranslations()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shopItems: DropdownItem[] = [
    { label: t('nav.shopDropdown.kits'), href: '/shop?category=kit', description: t('nav.shopDropdown.kitsDesc') },
    { label: t('nav.shopDropdown.spawn'), href: '/shop?category=spawn', description: t('nav.shopDropdown.spawnDesc') },
    { label: t('nav.shopDropdown.substrates'), href: '/shop?category=substrate', description: t('nav.shopDropdown.substratesDesc') },
    { label: t('nav.shopDropdown.equipment'), href: '/shop?category=equipment', description: t('nav.shopDropdown.equipmentDesc') },
    { label: t('nav.shopDropdown.wellness'), href: '/shop?category=wellness', description: t('nav.shopDropdown.wellnessDesc') },
    { label: t('nav.shopDropdown.bundles'), href: '/shop?category=bundle' },
  ]

  const learnItems: DropdownItem[] = [
    { label: t('nav.learnDropdown.beginners'), href: '/learn?category=beginners' },
    { label: t('nav.learnDropdown.indoor'), href: '/learn?category=indoor' },
    { label: t('nav.learnDropdown.outdoor'), href: '/learn?category=outdoor' },
    { label: t('nav.learnDropdown.lab'), href: '/learn?category=lab' },
    { label: t('nav.learnDropdown.science'), href: '/learn?category=science' },
    { label: t('nav.learnDropdown.recipes'), href: '/learn?category=recipes' },
  ]

  const toolItems: DropdownItem[] = [
    { label: t('nav.toolsDropdown.calculator'), href: '/tools/grow-calculator' },
    { label: t('nav.toolsDropdown.journal'), href: '/tools/grow-journal' },
    { label: t('nav.toolsDropdown.finder'), href: '/tools/species-finder' },
    { label: t('nav.toolsDropdown.mixer'), href: '/tools/substrate-mixer' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-30 transition-all duration-500',
          scrolled
            ? 'bg-bg/90 backdrop-blur-xl border-b border-accent/10 shadow-[0_1px_30px_rgba(0,255,184,0.04)]'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo */}
            <Logo size="sm" />

            {/* Center: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavDropdown
                label={t('nav.shop')}
                items={shopItems}
                footer={{ label: t('nav.shopDropdown.bySpecies'), href: '/encyclopedia' }}
              />
              <NavDropdown label={t('nav.learn')} items={learnItems} />
              <Link
                href="/encyclopedia"
                className="text-sm font-body font-medium text-cream-muted hover:text-accent transition-colors px-3 py-2"
              >
                {t('nav.encyclopedia')}
              </Link>
              <NavDropdown label={t('nav.tools')} items={toolItems} />
              <Link
                href="/community"
                className="text-sm font-body font-medium text-cream-muted hover:text-accent transition-colors px-3 py-2"
              >
                {t('nav.community')}
              </Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                className="hidden lg:flex items-center justify-center w-9 h-9 text-cream-muted hover:text-accent rounded-xl hover:bg-accent/8 transition-colors"
                aria-label={t('nav.search')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {/* Language */}
              <LanguageSwitcher className="hidden lg:flex" />

              {/* Account */}
              <Link
                href="/account"
                className="hidden lg:flex items-center justify-center w-9 h-9 text-cream-muted hover:text-accent rounded-xl hover:bg-accent/8 transition-colors"
                aria-label={t('nav.account')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center justify-center relative w-9 h-9 text-cream-muted hover:text-accent rounded-xl hover:bg-accent/8 transition-colors"
                aria-label={`${t('nav.cart')} (${cartCount})`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-[10px] flex items-center justify-center text-cream font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-9 h-9 text-cream-muted hover:text-accent rounded-xl hover:bg-accent/8 transition-colors"
                aria-label={t('nav.openMenu')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
