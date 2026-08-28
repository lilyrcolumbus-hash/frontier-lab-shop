import { AdminNavLink } from './AdminNavLink'
import { AdminSignOutButton } from './AdminSignOutButton'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Catalog',
    items: [
      {
        label: 'Products',
        href: '/admin/products',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ),
      },
      {
        label: 'Species',
        href: '/admin/species',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2s7 4.5 7 11a7 7 0 0 1-14 0c0-6.5 7-11 7-11Z" />
          </svg>
        ),
      },
      {
        label: 'Collections',
        href: '/admin/collections',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7 12 3 4 7l8 4 8-4Z" />
            <path d="M4 7v10l8 4 8-4V7" />
            <path d="M12 11v10" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Store',
    items: [
      {
        label: 'Orders',
        href: '/admin/orders',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        ),
      },
      {
        label: 'Customers',
        href: '/admin/customers',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
    ],
  },
]

export function AdminShell({
  storeName,
  userEmail,
  children,
}: {
  storeName: string
  userEmail: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg text-cream grid grid-cols-[240px_1fr]">
      <aside className="border-r border-ds-border bg-surface flex flex-col gap-1 py-5 px-3">
        <div className="flex items-center gap-2 px-2 pb-5">
          <div className="w-7 h-7 rounded-md bg-accent text-surface flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {storeName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">{storeName}</div>
            <div className="text-[10px] uppercase tracking-wider text-cream-muted">Admin</div>
          </div>
        </div>

        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="px-2 pt-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-cream-muted">
              {section.label}
            </div>
            {section.items.map((item) => (
              <AdminNavLink key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </div>
        ))}
      </aside>

      <div>
        <div className="border-b border-ds-border bg-surface px-6 py-3.5 flex items-center justify-end gap-4">
          <span className="text-xs text-cream-muted">{userEmail}</span>
          <AdminSignOutButton />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </div>
    </div>
  )
}
