import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
}

const sizes = {
  sm: { dirty: 'text-2xl', shrooms: '1.3rem' },
  md: { dirty: 'text-4xl', shrooms: '1.7rem' },
  lg: { dirty: 'text-6xl', shrooms: '2.5rem' },
}

export function Logo({ size = 'md', href = '/', showTagline, className }: LogoProps) {
  const s = sizes[size]

  const content = (
    <div className={cn('flex flex-col items-start', className)}>
      <div className="flex items-baseline gap-0">
        <span
          className={cn('font-display uppercase leading-none tracking-[0.05em]', s.dirty)}
          style={{ color: '#00FFB8', textShadow: '0 0 20px rgba(0,255,184,0.5), 0 0 40px rgba(0,255,184,0.2)' }}
        >
          DIRTY
        </span>
        <span
          className="font-accent italic lowercase leading-none text-cream/90"
          style={{ fontSize: s.shrooms }}
        >
          shrooms
        </span>
      </div>
      {showTagline && (
        <span className="font-mono font-light uppercase tracking-[0.2em] text-[10px] mt-0.5 text-cream-muted/70">
          Grow Something Filthy
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block hover:opacity-85 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
