import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
  /** true = white wordmark for dark backgrounds, false = dark wordmark for light backgrounds */
  light?: boolean
}

// Double-helix glyph replacing the "I" in FRONTIER — two sine strands, sampled from
// real trig (not hand-drawn), 2 full periods top to bottom.
const HELIX_VIEWBOX = '0 0 24 64'
const HELIX_STRAND_A =
  'M 12 0 L 13.68 1.33 L 15.25 2.67 L 16.6 4 L 17.63 5.33 L 18.28 6.67 L 18.5 8 L 18.28 9.33 L 17.63 10.67 L 16.6 12 L 15.25 13.33 L 13.68 14.67 L 12 16 L 10.32 17.33 L 8.75 18.67 L 7.4 20 L 6.37 21.33 L 5.72 22.67 L 5.5 24 L 5.72 25.33 L 6.37 26.67 L 7.4 28 L 8.75 29.33 L 10.32 30.67 L 12 32 L 13.68 33.33 L 15.25 34.67 L 16.6 36 L 17.63 37.33 L 18.28 38.67 L 18.5 40 L 18.28 41.33 L 17.63 42.67 L 16.6 44 L 15.25 45.33 L 13.68 46.67 L 12 48 L 10.32 49.33 L 8.75 50.67 L 7.4 52 L 6.37 53.33 L 5.72 54.67 L 5.5 56 L 5.72 57.33 L 6.37 58.67 L 7.4 60 L 8.75 61.33 L 10.32 62.67 L 12 64'
const HELIX_STRAND_B =
  'M 12 0 L 10.32 1.33 L 8.75 2.67 L 7.4 4 L 6.37 5.33 L 5.72 6.67 L 5.5 8 L 5.72 9.33 L 6.37 10.67 L 7.4 12 L 8.75 13.33 L 10.32 14.67 L 12 16 L 13.68 17.33 L 15.25 18.67 L 16.6 20 L 17.63 21.33 L 18.28 22.67 L 18.5 24 L 18.28 25.33 L 17.63 26.67 L 16.6 28 L 15.25 29.33 L 13.68 30.67 L 12 32 L 10.32 33.33 L 8.75 34.67 L 7.4 36 L 6.37 37.33 L 5.72 38.67 L 5.5 40 L 5.72 41.33 L 6.37 42.67 L 7.4 44 L 8.75 45.33 L 10.32 46.67 L 12 48 L 13.68 49.33 L 15.25 50.67 L 16.6 52 L 17.63 53.33 L 18.28 54.67 L 18.5 56 L 18.28 57.33 L 17.63 58.67 L 16.6 60 L 15.25 61.33 L 13.68 62.67 L 12 64'

function HelixIcon({ heightPx }: { heightPx: number }) {
  const widthPx = heightPx * (24 / 64)
  return (
    <svg
      viewBox={HELIX_VIEWBOX}
      width={widthPx}
      height={heightPx}
      style={{ display: 'inline-block', verticalAlign: 'baseline', margin: '0 1px' }}
      aria-hidden="true"
    >
      <path d={HELIX_STRAND_A} stroke="#9E6820" strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <path d={HELIX_STRAND_B} stroke="#9E6820" strokeWidth={2.4} strokeLinecap="round" fill="none" opacity={0.6} />
    </svg>
  )
}

const configs = {
  sm: { fontSize: 18, helixPx: 13, gap: 8 },
  md: { fontSize: 24, helixPx: 17, gap: 10 },
  lg: { fontSize: 36, helixPx: 26, gap: 14 },
}

const HELVETICA = "'Helvetica Neue', Helvetica, Arial, sans-serif"

export function Logo({ size = 'md', href = '/', showTagline, className, light = false }: LogoProps) {
  const cfg = configs[size]
  const wordmarkColor = light ? '#FFFFFF' : '#1C2018'

  const content = (
    <div className={cn('flex flex-col items-start select-none', className)}>
      <div className="flex items-baseline leading-none whitespace-nowrap" style={{ gap: cfg.gap }}>
        <span
          style={{
            fontFamily: HELVETICA,
            fontWeight: 300,
            fontSize: cfg.fontSize,
            letterSpacing: '-0.01em',
            color: wordmarkColor,
          }}
        >
          FRONTI
          <HelixIcon heightPx={cfg.helixPx} />
          ER
        </span>
        <span
          style={{
            fontFamily: HELVETICA,
            fontWeight: 400,
            fontSize: cfg.fontSize,
            letterSpacing: '0.3em',
            color: wordmarkColor,
          }}
        >
          LAB
        </span>
      </div>

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
