import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  /** pass the translated tagline text to show it below the logo */
  tagline?: string
  className?: string
  /** true = white logo for dark backgrounds, false = black logo for light backgrounds */
  light?: boolean
}

/**
 * FRONTIER LAB — official logo: mountain range above the stacked wordmark
 * (Inter ExtraBold FRONTIER / Bold LAB). Black or white PNG with a transparent background,
 * both in `public/brand/` (1400 px wide, aspect 3065:1199).
 */
const WIDTH: Record<NonNullable<LogoProps['size']>, number> = {
  sm: 120,
  md: 160,
  lg: 230,
}
const ASPECT = 1199 / 3065

export function Logo({ size = 'md', href = '/', tagline, className, light = false }: LogoProps) {
  const width = WIDTH[size]
  const height = Math.round(width * ASPECT)

  // Contrast insurance for the light (dark-background) state: the header's own scrim already
  // guarantees a dark base; this adds a second layer so the logo never washes out against a
  // busy, moving background like the hero video.
  const filter = light
    ? 'drop-shadow(0 1px 5px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(0,0,0,0.3))'
    : undefined

  const content = (
    <div className={cn('flex flex-col items-start select-none', className)}>
      <Image
        src={light ? '/brand/logo-white.png' : '/brand/logo-black.png'}
        alt="Frontier Lab"
        width={width}
        height={height}
        priority
        style={{ width, height: 'auto', filter }}
      />

      {tagline && (
        <span className="font-mono font-light uppercase tracking-[0.22em] text-[9px] mt-1.5 text-cream-muted/50">
          {tagline}
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
