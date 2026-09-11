import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  /** pass the translated tagline text to show it below the wordmark */
  tagline?: string
  className?: string
  /** true = cream wordmark for dark backgrounds, false = dark wordmark for light backgrounds */
  light?: boolean
  /** true = monochrome (helix same colour as the wordmark). Default: amber-gold helix. */
  mono?: boolean
}

/**
 * FRONTIER LAB — official logo. Stacked wordmark (Inter ExtraBold FRONTIER / Bold LAB,
 * LAB right-aligned under FRONTIER) with a DNA double-helix replacing the "I".
 * Canonical spec + exported assets: `public/brand/` (kept in sync with the
 * openart-agent repo, `data/brands/frontier-lab-logo/`).
 *
 * Rendered as live text in Inter (already loaded via next/font in app/layout.tsx)
 * plus the helix as inline SVG geometry, so it scales cleanly and stays editable.
 */

const INK = '#1C2018'
const CREAM = '#F4F1EA'
const GOLD = '#9E6820'

// helix "w1" geometry — narrow twisted column that reads as both "I" and DNA
const HW = 100
const HH = 320
const HSW = 16
const HAMP = 24
const HSTEPS = 60
const HCX = HW / 2
const HY0 = HSW / 2
const HY1 = HH - HSW / 2
const yAt = (t: number) => HY0 + t * (HY1 - HY0)
const strandPoints = (sign: 1 | -1) =>
  Array.from({ length: HSTEPS + 1 }, (_, i) => {
    const t = i / HSTEPS
    return `${(HCX + sign * HAMP * Math.sin(2 * Math.PI * t)).toFixed(2)},${yAt(t).toFixed(2)}`
  }).join(' ')
const RUNGS = [0.18, 0.32, 0.68, 0.82].map((t) => {
  const x = HAMP * Math.sin(2 * Math.PI * t)
  return { x1: HCX + x, x2: HCX - x, y: yAt(t) }
})
const HXPAD = HAMP + HSW / 2 + 3
const HELIX_VIEWBOX = `${HCX - HXPAD} 0 ${HXPAD * 2} ${HH}`
// width of the "I" slot, in em relative to the FRONTIER font-size
const HELIX_EM_WIDTH = (0.727 * (HXPAD * 2)) / HH

function Helix({ color }: { color: string }) {
  return (
    <svg
      viewBox={HELIX_VIEWBOX}
      style={{
        display: 'inline-block',
        height: '0.727em',
        width: `${HELIX_EM_WIDTH.toFixed(4)}em`,
        margin: '0 0.02em',
        verticalAlign: 'baseline',
      }}
      aria-hidden="true"
    >
      <polyline points={strandPoints(1)} fill="none" stroke={color} strokeWidth={HSW} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={strandPoints(-1)} fill="none" stroke={color} strokeWidth={HSW} strokeLinecap="round" strokeLinejoin="round" />
      {RUNGS.map((r, i) => (
        <line key={i} x1={r.x1} y1={r.y} x2={r.x2} y2={r.y} stroke={color} strokeWidth={HSW * 0.8} strokeLinecap="round" />
      ))}
    </svg>
  )
}

const FONT_SIZE: Record<NonNullable<LogoProps['size']>, number> = {
  sm: 32,
  md: 42,
  lg: 60,
}

export function Logo({ size = 'md', href = '/', tagline, className, light = false, mono = false }: LogoProps) {
  const textColor = light ? CREAM : INK
  const helixColor = mono ? textColor : GOLD
  const f = FONT_SIZE[size]

  // Contrast insurance for the light (dark-background) state — the header's own scrim already
  // guarantees a dark base; this adds a second layer so the wordmark never washes out against a
  // busy, moving background like the hero video.
  const wordmarkFilter = light
    ? 'drop-shadow(0 1px 5px rgba(0,0,0,0.55)) drop-shadow(0 0 14px rgba(0,0,0,0.3))'
    : undefined
  const helixFilter = mono ? undefined : 'drop-shadow(0 0 6px rgba(158,104,32,0.55))'

  const content = (
    <div className={cn('flex flex-col items-start select-none', className)} aria-label="Frontier Lab">
      <div
        style={{
          display: 'inline-block',
          textAlign: 'right',
          lineHeight: 0.9,
          color: textColor,
          filter: wordmarkFilter,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: f,
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          FRONT
          <span style={{ filter: helixFilter }}>
            <Helix color={helixColor} />
          </span>
          ER
        </div>
        <div
          style={{
            fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: f * 0.47,
            letterSpacing: '0.34em',
          }}
        >
          LAB
        </div>
      </div>

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
