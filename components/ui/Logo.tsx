import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
}

const sizes = {
  sm: { dirty: 'text-2xl', shrooms: '1.25rem' },
  md: { dirty: 'text-4xl', shrooms: '1.65rem' },
  lg: { dirty: 'text-6xl', shrooms: '2.4rem' },
}

export function Logo({ size = 'md', href = '/', showTagline, className }: LogoProps) {
  const s = sizes[size]

  const content = (
    <div className={cn('flex flex-col items-start', className)}>
      <div className="flex items-baseline gap-0">
        <span
          className={cn('font-display uppercase leading-none tracking-[0.05em]', s.dirty)}
          style={{
            color: '#D4913A',
            textShadow: '0 0 18px rgba(212,145,58,0.4), 0 0 40px rgba(212,145,58,0.15)',
          }}
        >
          DIRTY
        </span>
        <span
          className="font-accent italic lowercase leading-none"
          style={{ fontSize: s.shrooms, color: '#B8C9B0' }}
        >
          shrooms
        </span>
      </div>
      {showTagline && (
        <span className="font-mono font-light uppercase tracking-[0.22em] text-[10px] mt-0.5 text-cream-muted/60">
          Grow Something Filthy
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
