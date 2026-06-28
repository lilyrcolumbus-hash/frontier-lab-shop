'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useAnimation } from 'framer-motion'

export function PageTransition() {
  const pathname = usePathname()
  const controls = useAnimation()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    async function run() {
      controls.set({ scaleX: 0, opacity: 1 })
      await controls.start({
        scaleX: 1,
        transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
      })
      await controls.start({
        opacity: 0,
        transition: { duration: 0.28 },
      })
    }
    run()
  }, [pathname, controls])

  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 1 }}
      animate={controls}
      style={{ transformOrigin: 'left center' }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[9999] pointer-events-none"
      aria-hidden="true"
    />
  )
}
