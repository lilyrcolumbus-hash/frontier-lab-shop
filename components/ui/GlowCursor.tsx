'use client'

import { useEffect, useRef } from 'react'

export function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return // skip on touch

    const dot = dotRef.current
    const ring = ringRef.current
    const glow = glowRef.current
    if (!dot || !ring || !glow) return

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let glowX = ringX
    let glowY = ringY
    let raf: number

    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY

      dot.style.left = `${x}px`
      dot.style.top  = `${y}px`

      // lazy follow for ring and glow
      ringX += (x - ringX) * 0.14
      ringY += (y - ringY) * 0.14
      glowX += (x - glowX) * 0.05
      glowY += (y - glowY) * 0.05

      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      glow.style.left = `${glowX}px`
      glow.style.top  = `${glowY}px`
    }

    const tick = () => {
      // keep animating for smooth lag even without mouse movement
      raf = requestAnimationFrame(tick)
    }

    const addHover = () => ring.classList.add('hovered')
    const removeHover = () => ring.classList.remove('hovered')

    window.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('a, button, [role="button"], input, textarea, select').forEach((el) => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
