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
        label: 'Pages',
        ownerOnly: true,
        href: '/admin/pages',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
          </svg>
        ),
      },
      {
        label: 'Blog',
        ownerOnly: true,
        href: '/admin/blog',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9h4" />
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8Z" />
          </svg>
        ),
      },
      {
        label: 'Home page',
        ownerOnly: true,
        href: '/admin/appearance',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9 22V12h6v10" />
          </svg>
        ),
      },
      {
        label: 'Content',
        ownerOnly: true,
        href: '/admin/content',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
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
        label: 'Gift cards',
        ownerOnly: true,
        href: '/admin/gift-cards',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="8" width="18" height="13" rx="2" />
            <path d="M12 8v13M3 12h18M12 8a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 0a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" />
          </svg>
        ),
      },
      {
        label: 'Locations',
        ownerOnly: true,
        href: '/admin/locations',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        ),
      },
      {
        label: 'Shipping zones',
        ownerOnly: true,
        href: '/admin/shipping',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 17h4V5H2v12h3M15 17h2a2 2 0 0 0 2-2v-3l-3-4h-3v9h2Z" />
            <circle cx="7.5" cy="17.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
          </svg>
        ),
      },
      {
        label: 'Emails',
        ownerOnly: true,
        href: '/admin/emails',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 6L2 7" />
          </svg>
        ),
      },
      {
        label: 'Taxes',
        ownerOnly: true,
        href: '/admin/taxes',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 15 15 9" />
            <circle cx="9.5" cy="9.5" r="1.5" />
            <circle cx="14.5" cy="14.5" r="1.5" />
            <rect x="3" y="3" width="18" height="18" rx="2" />
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
  isDemo = false,
  children,
}: {
  storeName: string
  userEmail: string
  role: 'owner' | 'staff'
  isDemo?: boolean
  children: React.ReactNode
}) {
  // The API enforces this too — hiding a link is a courtesy, never the security boundary.
  const sections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => role === 'owner' || !item.ownerOnly),
  })).filter((section) => section.items.length > 0)

  return (
    <div className="min-h-screen bg-bg text-cream grid grid-cols-[240px_1fr] print:block print:min-h-0 print:bg-white">
      <aside className="border-r border-ds-border bg-surface flex flex-col gap-1 py-5 px-3 print:hidden">
        <div className="flex items-center gap-2 px-2 pb-5">
          <div className="w-7 h-7 rounded-none bg-accent text-surface flex items-center justify-center text-[11px] font-bold flex-shrink-0">
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
        <div className="border-b border-ds-border bg-surface px-6 py-3.5 flex items-center justify-end gap-4 print:hidden">
          <span className="text-xs text-cream-muted">
            {userEmail}
            <span className="ml-2 text-[10px] uppercase tracking-wider text-cream-muted/60">{role}</span>
          </span>
          <AdminSignOutButton />
        </div>
        {isDemo && (
          <div className="border-b border-ds-border bg-elevated px-6 py-2.5 text-center text-xs text-cream-muted print:hidden">
            <span className="font-semibold text-cream">Read-only demo.</span> Explore every screen: saving is switched off, and
            customer data is hidden.
          </div>
        )}
        <div className="max-w-6xl mx-auto px-6 py-10">{children}</div>
      </div>
    </div>
  )
}
