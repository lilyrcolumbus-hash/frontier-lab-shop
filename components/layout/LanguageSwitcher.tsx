'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return

    const newPath =
      newLocale === 'en'
        ? pathname.replace(/^\/es/, '') || '/'
        : `/es${pathname}`

    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    router.push(newPath)
  }

  return (
    <div className={cn('flex items-center gap-1 text-sm font-body font-medium', className)}>
      <button
        onClick={() => switchLocale('en')}
        className={cn(
          'px-2 py-0.5 rounded transition-colors',
          locale === 'en'
            ? 'text-cream'
            : 'text-cream-muted hover:text-cream'
        )}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-ds-border select-none">|</span>
      <button
        onClick={() => switchLocale('es')}
        className={cn(
          'px-2 py-0.5 rounded transition-colors',
          locale === 'es'
            ? 'text-cream'
            : 'text-cream-muted hover:text-cream'
        )}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
