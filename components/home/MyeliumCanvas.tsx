'use client'

import { useEffect, useRef } from 'react'

interface Node { x: number; y: number }
interface Connection {
  from: Node; to: Node
  progress: number; alpha: number
  state: 'growing' | 'stable' | 'fading'
  stableFrames: number
}
interface Spore {
  x: number; y: number
  vx: number; vy: number
  r: number; opacity: number
}

export function MyeliumCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    const NODE_COUNT = 45
    const MAX_DIST = 200

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
    }))

    const spores: Spore[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.4,
      opacity: Math.random() * 0.18 + 0.04,
    }))

    let connections: Connection[] = []
    let frame = 0

    const spawnConnection = () => {
      const i = Math.floor(Math.random() * NODE_COUNT)
      const j = Math.floor(Math.random() * NODE_COUNT)
      if (i === j) return
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      if (Math.sqrt(dx * dx + dy * dy) > MAX_DIST) return
      connections.push({
        from: nodes[i], to: nodes[j],
        progress: 0, alpha: 0,
        state: 'growing',
        stableFrames: 200 + Math.floor(Math.random() * 300),
      })
    }

    for (let i = 0; i < 18; i++) spawnConnection()

    const animate = () => {
      const w = W(), h = H()
      ctx.clearRect(0, 0, w, h)
      frame++

      if (frame % 45 === 0 && connections.length < 55) spawnConnection()

      connections = connections.filter(c => c.alpha > 0 || c.state !== 'fading')

      for (const c of connections) {
        if (c.state === 'growing') {
          c.progress = Math.min(1, c.progress + 0.007)
          c.alpha = Math.min(0.22, c.alpha + 0.004)
          if (c.progress >= 1) c.state = 'stable'
        } else if (c.state === 'stable') {
          c.stableFrames--
          if (c.stableFrames <= 0) c.state = 'fading'
        } else {
          c.alpha = Math.max(0, c.alpha - 0.0015)
        }

        if (c.alpha <= 0) continue
        const dx = c.to.x - c.from.x
        const dy = c.to.y - c.from.y
        ctx.beginPath()
        ctx.moveTo(c.from.x, c.from.y)
        ctx.lineTo(c.from.x + dx * c.progress, c.from.y + dy * c.progress)
        ctx.strokeStyle = `rgba(130,201,126,${c.alpha})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(130,201,126,0.12)'
        ctx.fill()
      }

      for (const s of spores) {
        s.x = (s.x + s.vx + w) % w
        s.y = (s.y + s.vy + h) % h
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.65 }}
    />
  )
}
