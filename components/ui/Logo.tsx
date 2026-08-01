import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showTagline?: boolean
  className?: string
}

// Mushroom-shaped "i" — stem + dome cap replace the normal letter
function MushroomI({ scale = 1 }: { scale?: number }) {
  const w = 10 * scale
  const h = 26 * scale
  const capH = 11 * scale
  const stemW = 3.2 * scale
  const stemX = (w - stemW) / 2

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      style={{ display: 'inline-block', verticalAlign: 'bottom', marginBottom: 1 * scale }}
      aria-hidden="true"
    >
      {/* Mushroom cap dome */}
      <path
        d={`
          M ${w * 0.06} ${capH}
          Q ${w * 0.0} ${capH * 0.35} ${w * 0.5} ${1 * scale}
          Q ${w * 1.0} ${capH * 0.35} ${w * 0.94} ${capH}
          Z
        `}
        fill="rgba(212,145,58,0.9)"
        style={{ filter: `drop-shadow(0 0 ${3 * scale}px rgba(212,145,58,0.5))` }}
      />
      {/* Skirt / veil hint */}
      <path
        d={`M ${w * 0.08} ${capH * 1.02} Q ${w * 0.5} ${capH * 1.18} ${w * 0.92} ${capH * 1.02}`}
        stroke="rgba(212,145,58,0.35)"
        strokeWidth={0.8 * scale}
        fill="none"
      />
      {/* Stem */}
      <rect
        x={stemX}
        y={capH * 1.06}
        width={stemW}
        height={h - capH * 1.1}
        rx={stemW * 0.4}
        fill="rgba(212,145,58,0.8)"
      />
      {/* Glow orb at cap tip */}
      <circle
        cx={w * 0.5}
        cy={2 * scale}
        r={1.5 * scale}
        fill="rgba(232,200,122,0.6)"
      />
    </svg>
  )
}

const configs = {
  sm: { shroomsSize: 20, dirtySize: 11, scale: 0.72, gap: -1 },
  md: { shroomsSize: 29, dirtySize: 14, scale: 1.0,  gap: -2 },
  lg: { shroomsSize: 44, dirtySize: 20, scale: 1.5,  gap: -4 },
}

export function Logo({ size = 'md', href = '/', showTagline, className }: LogoProps) {
  const cfg = configs[size]

  const content = (
    <div className={cn('flex flex-col items-start select-none', className)}>

      {/* ── "Frontier Lab" — the protagonist ── */}
      <span
        className="font-heading font-bold text-cream tracking-tight leading-none whitespace-nowrap"
        style={{
          fontSize: cfg.shroomsSize,
          textShadow: '0 0 30px rgba(212,145,58,0.08)',
        }}
      >
        Frontier Lab
      </span>

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
