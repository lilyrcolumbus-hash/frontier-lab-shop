import { useTranslations } from 'next-intl'

const items = [
  {
    key: 'growers' as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'organic' as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 2a14.5 14.5 0 0 1 4 10c0 5.5-4.5 7-4.5 7" />
        <path d="M2 12c0-5.5 4.5-7 4.5-7" />
        <path d="M22 2c-2 4-4 5-7 5" />
      </svg>
    ),
  },
  {
    key: 'guarantee' as const,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
]

export function TrustBar() {
  const t = useTranslations('home.trust')

  return (
    <div className="bg-surface border-y border-ds-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0">
          {items.map((item, i) => (
            <div key={item.key} className="flex items-center gap-4 justify-center sm:justify-start">
              {i > 0 && (
                <div className="hidden sm:block w-px h-12 bg-ds-border mx-6" aria-hidden="true" />
              )}
              <span className="text-moss flex-shrink-0">{item.icon}</span>
              <p className="font-body font-medium text-cream text-sm sm:text-base">
                {t(item.key)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
