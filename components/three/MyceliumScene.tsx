'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 90
const CONNECTION_DISTANCE = 3.2
const MAX_CONNECTIONS = 400

interface NodeData {
  pos: THREE.Vector3
  vel: THREE.Vector3
  phase: number
  size: number
  color: THREE.Color
}

const COLORS = [
  new THREE.Color(0x00FFB8), // cyan
  new THREE.Color(0x00FFB8),
  new THREE.Color(0x00FFB8),
  new THREE.Color(0x7C3AED), // violet
  new THREE.Color(0xFFAE00), // gold
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
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)

    // ── Nodes ──────────────────────────────────────
    const nodes: NodeData[] = []
    const meshes: THREE.Mesh[] = []

    const sphereGeo = new THREE.SphereGeometry(1, 8, 8)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const isHub = Math.random() < 0.15
      const size = isHub ? 0.055 + Math.random() * 0.04 : 0.02 + Math.random() * 0.025

      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: isHub ? 0.9 : 0.7 })
      const mesh = new THREE.Mesh(sphereGeo, mat)

      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 5,
      )
      mesh.position.copy(pos)
      mesh.scale.setScalar(size)
      scene.add(mesh)
      meshes.push(mesh)

      nodes.push({
        pos,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.006,
          (Math.random() - 0.5) * 0.001,
        ),
        phase: Math.random() * Math.PI * 2,
        size,
        color: color.clone(),
      })
    }

    // ── Connection lines ──────────────────────────
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6)
    const lineColors = new Float32Array(MAX_CONNECTIONS * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3))

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.18,
      linewidth: 1,
    })
    const lines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(lines)

    // ── Mouse ─────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 22
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 14
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── Resize ────────────────────────────────────
    const handleResize = () => {
      const nW = window.innerWidth
      const nH = window.innerHeight
      camera.aspect = nW / nH
      camera.updateProjectionMatrix()
      renderer.setSize(nW, nH)
    }
    window.addEventListener('resize', handleResize)

    // ── Animation loop ─────────────────────────────
    let frameId: number
    let lineCount = 0
    const clock = new THREE.Clock()
    const tempColor = new THREE.Color()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      lineCount = 0

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const n = nodes[i]

        // drift
        n.pos.add(n.vel)

        // bounce bounds
        if (Math.abs(n.pos.x) > 11) n.vel.x *= -1
        if (Math.abs(n.pos.y) > 7)  n.vel.y *= -1
        if (Math.abs(n.pos.z) > 2.5) n.vel.z *= -1

        // gentle mouse attraction
        const dx = mouse.x - n.pos.x
        const dy = mouse.y - n.pos.y
        const d2 = dx * dx + dy * dy
        if (d2 < 20) {
          n.pos.x += dx * 0.0004
          n.pos.y += dy * 0.0004
        }

        // pulsing opacity
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + n.phase)
        ;(meshes[i].material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.6 * pulse

        meshes[i].position.copy(n.pos)
      }

      // connections
      for (let i = 0; i < PARTICLE_COUNT && lineCount < MAX_CONNECTIONS; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineCount < MAX_CONNECTIONS; j++) {
          const dist = nodes[i].pos.distanceTo(nodes[j].pos)
          if (dist < CONNECTION_DISTANCE) {
            const alpha = 1 - dist / CONNECTION_DISTANCE
            const base = lineCount * 6

            linePositions[base]     = nodes[i].pos.x
            linePositions[base + 1] = nodes[i].pos.y
            linePositions[base + 2] = nodes[i].pos.z
            linePositions[base + 3] = nodes[j].pos.x
            linePositions[base + 4] = nodes[j].pos.y
            linePositions[base + 5] = nodes[j].pos.z

            // blend color from both nodes
            tempColor.copy(nodes[i].color).lerp(nodes[j].color, 0.5)
            lineColors[base]     = tempColor.r * alpha
            lineColors[base + 1] = tempColor.g * alpha
            lineColors[base + 2] = tempColor.b * alpha
            lineColors[base + 3] = tempColor.r * alpha
            lineColors[base + 4] = tempColor.g * alpha
            lineColors[base + 5] = tempColor.b * alpha

            lineCount++
          }
        }
      }

      // clear unused
      for (let i = lineCount * 6; i < MAX_CONNECTIONS * 6; i++) {
        linePositions[i] = 0
        lineColors[i] = 0
      }

      lineGeo.attributes.position.needsUpdate = true
      lineGeo.attributes.color.needsUpdate = true
      lineGeo.setDrawRange(0, lineCount * 2)

      // slow camera sway
      camera.position.x = Math.sin(t * 0.08) * 0.4
      camera.position.y = Math.cos(t * 0.06) * 0.25
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      sphereGeo.dispose()
      lineGeo.dispose()
      lineMat.dispose()
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
