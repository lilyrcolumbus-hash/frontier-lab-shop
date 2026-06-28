'use client'

import { useEffect, useRef } from 'react'

export function GlowCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const outer = outerRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!outer || !ring || !dot) return

    let rx = window.innerWidth / 2, ry = window.innerHeight / 2
    let tx = rx, ty = ry
    let raf: number

    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }

    const tick = () => {
      rx += (tx - rx) * 0.1
      ry += (ty - ry) * 0.1
      // Outer wrapper handles position — ring CSS animation handles breathing (no conflict)
      outer.style.transform = `translate(${rx}px, ${ry}px)`
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    const addHover = () => ring.classList.add('organic-ring--hover')
    const removeHover = () => ring.classList.remove('organic-ring--hover')

    outer.style.opacity = '1'
    dot.style.opacity = '1'

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <>
      <style>{`
        @media (pointer: fine) {
          html, html * { cursor: none !important; }
        }
        .cursor-outer {
          position: fixed; top: 0; left: 0;
          pointer-events: none; z-index: 9998;
          opacity: 0;
          will-change: transform;
        }
        .organic-ring {
          width: 38px; height: 38px;
          border: 1.5px solid rgba(61,110,69,0.48);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: cursor-breathe 2.8s ease-in-out infinite;
          transition: width 0.35s cubic-bezier(.16,1,.3,1),
                      height 0.35s cubic-bezier(.16,1,.3,1),
                      border-color 0.35s;
        }
        .organic-ring--hover {
          width: 56px; height: 56px;
          border-color: rgba(61,110,69,0.78);
        }
        /* Only animate scale — position is controlled by JS on the outer wrapper */
        @keyframes cursor-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50%       { transform: translate(-50%, -50%) scale(1.22); }
        }
        .organic-dot {
          position: fixed; top: 0; left: 0;
          width: 5px; height: 5px;
          background: rgba(61,110,69,0.88);
          border-radius: 50%;
          pointer-events: none; z-index: 9999;
          opacity: 0;
          will-change: transform;
        }
      `}</style>
      <div ref={outerRef} className="cursor-outer" aria-hidden="true">
        <div ref={ringRef} className="organic-ring" />
      </div>
      <div ref={dotRef} className="organic-dot" aria-hidden="true" />
    </>
  )
}
