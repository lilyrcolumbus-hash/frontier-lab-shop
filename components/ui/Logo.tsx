import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
  /** true = cream wordmark for dark backgrounds, false = dark wordmark for light backgrounds */
  light?: boolean
}

// The approved final logo — horizontal lockup (FRONTIER + helix + LAB on one line), the variant
// meant for general use like the header/footer (the stacked variant is reserved for favicon/social
// squares). Real exported artwork from ~/Desktop/Frontier Lab Logo/palette-amber-{dark,white}.png —
// not a live-text reconstruction, so it never depends on a font being installed on the viewer's machine.
const SRC_DARK = '/images/brand/logo-horizontal-dark.png'
const SRC_CREAM = '/images/brand/logo-horizontal-cream.png'
const ASPECT = 3954 / 574

const configs = {
  sm: { height: 22 },
  md: { height: 30 },
  lg: { height: 44 },
}

export function Logo({ size = 'md', href = '/', showTagline, className, light = false }: LogoProps) {
  const cfg = configs[size]
  const width = Math.round(cfg.height * ASPECT)
  // Contrast insurance for the light (dark-background) state — the header's own scrim already
  // guarantees a dark base, this adds a second layer so the wordmark never washes out against a
  // busy, moving background like the hero video.
  const filter = light
    ? 'drop-shadow(0 1px 5px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(0,0,0,0.3))'
    : 'none'

  const content = (
    <div className={cn('flex flex-col items-start select-none', className)}>
      <Image
        src={light ? SRC_CREAM : SRC_DARK}
        alt="Frontier Lab"
        width={width}
        height={cfg.height}
        priority
        style={{ filter, width, height: cfg.height }}
      />

      {showTagline && (
        <span className="font-mono font-light uppercase tracking-[0.22em] text-[9px] mt-1.5 text-cream-muted/50">
          Wild Genetics. Lab Verified.
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
