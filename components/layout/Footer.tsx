import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/ui/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'

const socials = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/dirtyshrooms',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@dirtyshrooms',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@dirtyshrooms',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/dirtyshrooms',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
]

export function Footer() {
  const t = useTranslations()

  return (
    <footer style={{ backgroundColor: '#0A1A0F' }} className="border-t border-ds-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Logo size="sm" showTagline />
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-muted hover:text-cream transition-colors"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Shop */}
          <FooterCol title={t('footer.shop.title')}>
            <FooterLink href="/shop?category=kit">{t('footer.shop.kits')}</FooterLink>
            <FooterLink href="/shop?category=spawn">{t('footer.shop.spawn')}</FooterLink>
            <FooterLink href="/shop?category=substrate">{t('footer.shop.substrates')}</FooterLink>
            <FooterLink href="/shop?category=equipment">{t('footer.shop.equipment')}</FooterLink>
            <FooterLink href="/shop?category=wellness">{t('footer.shop.wellness')}</FooterLink>
            <FooterLink href="/shop?category=bundle">{t('footer.shop.bundles')}</FooterLink>
          </FooterCol>

          {/* Col 3 — Learn */}
          <FooterCol title={t('footer.learn.title')}>
            <FooterLink href="/learn?category=beginners">{t('footer.learn.beginners')}</FooterLink>
            <FooterLink href="/learn?category=indoor">{t('footer.learn.indoor')}</FooterLink>
            <FooterLink href="/learn?category=outdoor">{t('footer.learn.outdoor')}</FooterLink>
            <FooterLink href="/learn?category=lab">{t('footer.learn.lab')}</FooterLink>
            <FooterLink href="/learn?category=science">{t('footer.learn.science')}</FooterLink>
          </FooterCol>

          {/* Col 4 — Company */}
          <FooterCol title={t('footer.company.title')}>
            <FooterLink href="/about">{t('footer.company.about')}</FooterLink>
            <FooterLink href="/sustainability">{t('footer.company.sustainability')}</FooterLink>
            <FooterLink href="/careers">{t('footer.company.careers')}</FooterLink>
            <FooterLink href="/press">{t('footer.company.press')}</FooterLink>
            <FooterLink href="/affiliates">{t('footer.company.affiliates')}</FooterLink>
          </FooterCol>

          {/* Col 5 — Support */}
          <FooterCol title={t('footer.support.title')}>
            <FooterLink href="/faq">{t('footer.support.faq')}</FooterLink>
            <FooterLink href="/shipping">{t('footer.support.shipping')}</FooterLink>
            <FooterLink href="/returns">{t('footer.support.returns')}</FooterLink>
            <FooterLink href="/track">{t('footer.support.track')}</FooterLink>
            <FooterLink href="/contact">{t('footer.support.contact')}</FooterLink>
          </FooterCol>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ds-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream-muted">{t('footer.copyright')}</p>
          <div className="flex items-center gap-4">
            <FooterLink href="/privacy">{t('footer.privacy')}</FooterLink>
            <FooterLink href="/terms">{t('footer.terms')}</FooterLink>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-body font-semibold text-cream uppercase tracking-wider mb-4">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-sm text-cream-muted hover:text-cream transition-colors">
      {children}
    </Link>
  )
}
