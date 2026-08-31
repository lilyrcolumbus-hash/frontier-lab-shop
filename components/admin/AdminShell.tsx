import { AdminNavLink } from './AdminNavLink'
import { AdminSignOutButton } from './AdminSignOutButton'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  /** Hidden from staff — these pages move money, change settings, or grant access. */
  ownerOnly?: boolean
}

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Analytics',
        href: '/admin',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18.7 8 12 14.5l-3.5-3.5L4 15.5" />
          </svg>
        ),
      },
    ],
  },
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
      {
        label: 'Discounts',
        ownerOnly: true,
        href: '/admin/discounts',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 9 6 6" />
            <circle cx="9" cy="9" r="1" />
            <circle cx="15" cy="15" r="1" />
            <path d="M4 5h6l10 10-6 6L4 11V5Z" />
          </svg>
        ),
      },
      {
        label: 'Staff',
        ownerOnly: true,
        href: '/admin/staff',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          </svg>
        ),
      },
      {
        label: 'Settings',
        ownerOnly: true,
        href: '/admin/settings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
          </svg>
        ),
      },
    ],
  },
]

export function AdminShell({
  storeName,
  userEmail,
  role,
  children,
}: {
  storeName: string
  userEmail: string
  role: 'owner' | 'staff'
  children: React.ReactNode
}) {
  // The API enforces this too — hiding a link is a courtesy, never the security boundary.
  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => role === 'owner' || !item.ownerOnly),
  })).filter((section) => section.items.length > 0)

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

        {sections.map((section) => (
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
          <span className="text-xs text-cream-muted">
            {userEmail}
            <span className="ml-2 text-[10px] uppercase tracking-wider text-cream-muted/60">{role}</span>
          </span>
          <AdminSignOutButton />
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </div>
    </div>
  )
}
