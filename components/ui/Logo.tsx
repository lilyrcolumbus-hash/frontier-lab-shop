import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
}

const sizes = {
  sm: { dirty: 'text-2xl', shrooms: 'text-xl' },
  md: { dirty: 'text-4xl', shrooms: 'text-3xl' },
  lg: { dirty: 'text-6xl', shrooms: 'text-5xl' },
}

export function Logo({ size = 'md', href = '/', showTagline, className }: LogoProps) {
  const s = sizes[size]

  const content = (
    <div className={cn('flex flex-col items-start', className)}>
      <div className="flex items-baseline gap-0">
        <span
          className={cn(
            'font-display uppercase leading-none tracking-[0.05em]',
            s.dirty
          )}
          style={{ color: '#C45E2A' }}
        >
          DIRTY
        </span>
        <span
          className={cn(
            'font-accent italic lowercase leading-none',
            s.shrooms
          )}
          style={{ color: '#F5EDD6', fontSize: `calc(${s.dirty.replace('text-', '')} * 0.65)` }}
        >
          shrooms
        </span>
      </div>
      {showTagline && (
        <span
          className="font-body font-light uppercase tracking-[0.2em] text-xs mt-0.5"
          style={{ color: '#4A7C59' }}
        >
          Grow Something Filthy
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
