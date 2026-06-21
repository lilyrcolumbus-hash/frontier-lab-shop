'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const FIREFLY_COUNT = 65
const SPORE_COUNT = 30

interface Firefly {
  pos: THREE.Vector3
  vel: THREE.Vector3
  phase: number
  phaseSpeed: number
  size: number
  color: THREE.Color
  sineX: number
  sineZ: number
  driftDir: THREE.Vector3
}

const FIREFLY_COLORS = [
  new THREE.Color(0xD4913A), // amber warm
  new THREE.Color(0xE8A84A), // amber bright
  new THREE.Color(0xC87A20), // amber deep
  new THREE.Color(0x6BBF6A), // moss glow
  new THREE.Color(0xA0D49E), // pale moss
]

const SPORE_COLORS = [
  new THREE.Color(0x6BBF6A),
  new THREE.Color(0x8B6BB5),
]

export function MyceliumScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100)
    camera.position.set(0, 0, 10)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)

    // ── Fireflies ──────────────────────────────────────
    const fireflies: Firefly[] = []
    const ffMeshes: THREE.Mesh[] = []
    const ffGeo = new THREE.SphereGeometry(1, 8, 8)

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const color = FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)]
      const isLarge = Math.random() < 0.2
      const size = isLarge ? 0.05 + Math.random() * 0.04 : 0.015 + Math.random() * 0.025

      const mat = new THREE.MeshBasicMaterial({
        color: color.clone(),
        transparent: true,
        opacity: 0.8,
      })
      const mesh = new THREE.Mesh(ffGeo, mat)

      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 24,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 6,
      )
      mesh.position.copy(pos)
      mesh.scale.setScalar(size)
      scene.add(mesh)
      ffMeshes.push(mesh)

      fireflies.push({
        pos,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          Math.random() * 0.004 + 0.001, // mostly drift upward
          (Math.random() - 0.5) * 0.001,
        ),
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.4 + Math.random() * 0.8,
        size,
        color: color.clone(),
        sineX: (Math.random() - 0.5) * 0.008,
        sineZ: (Math.random() - 0.5) * 0.004,
        driftDir: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          0,
          0,
        ),
      })
    }

    // ── Spore particles (smaller, faster) ──────────────
    const spores: { pos: THREE.Vector3; vel: THREE.Vector3; mesh: THREE.Mesh; phase: number }[] = []
    const sporeGeo = new THREE.SphereGeometry(1, 5, 5)

    for (let i = 0; i < SPORE_COUNT; i++) {
      const color = SPORE_COLORS[Math.floor(Math.random() * SPORE_COLORS.length)]
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
      const mesh = new THREE.Mesh(sporeGeo, mat)
      const size = 0.006 + Math.random() * 0.01

      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        -10 - Math.random() * 5,
        (Math.random() - 0.5) * 4,
      )
      mesh.position.copy(pos)
      mesh.scale.setScalar(size)
      scene.add(mesh)

      spores.push({
        pos,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          0.008 + Math.random() * 0.01,
          0,
        ),
        mesh,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // ── Mouse parallax ────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize ────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation ─────────────────────────────────────
    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

for (let i = 0; i < FIREFLY_COUNT; i++) {
        const ff = fireflies[i]

        // organic sine drift
        ff.pos.x += ff.vel.x + Math.sin(t * ff.phaseSpeed + ff.phase) * ff.sineX
        ff.pos.y += ff.vel.y
        ff.pos.z += ff.vel.z + Math.cos(t * ff.phaseSpeed * 0.7 + ff.phase) * ff.sineZ

        // gentle x drift
        ff.pos.x += ff.driftDir.x * Math.sin(t * 0.15 + ff.phase)

        // wrap vertically — respawn at bottom when they reach top
        if (ff.pos.y > 10) {
          ff.pos.y = -10 - Math.random() * 4
          ff.pos.x = (Math.random() - 0.5) * 24
        }
        // wrap horizontally
        if (Math.abs(ff.pos.x) > 13) ff.pos.x *= -0.8

        // pulsing glow
        const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * ff.phaseSpeed + ff.phase))
        ;(ffMeshes[i].material as THREE.MeshBasicMaterial).opacity = pulse

        ffMeshes[i].position.copy(ff.pos)
      }

      // spores drift upward
      for (const s of spores) {
        s.pos.x += s.vel.x * Math.sin(t * 0.3 + s.phase)
        s.pos.y += s.vel.y
        if (s.pos.y > 10) {
          s.pos.y = -10 - Math.random() * 3
          s.pos.x = (Math.random() - 0.5) * 28
        }
        s.mesh.position.copy(s.pos)
        ;(s.mesh.material as THREE.MeshBasicMaterial).opacity =
          0.2 + 0.3 * (0.5 + 0.5 * Math.sin(t * 0.8 + s.phase))
      }

      // subtle camera parallax with mouse
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.02
      camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.02
      // slow camera breathe
      camera.position.z = 10 + Math.sin(t * 0.1) * 0.3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      ffGeo.dispose()
      sporeGeo.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
