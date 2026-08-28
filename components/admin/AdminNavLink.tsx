'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const active = pathname?.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
        active ? 'bg-accent-dim text-accent' : 'text-cream-muted hover:bg-elevated hover:text-cream'
      }`}
    >
      {icon}
      {label}
    </Link>
  )
}
