'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
  once?: boolean
  margin?: string
}

const dirMap = {
  up:    { y: 40, x: 0 },
  down:  { y: -30, x: 0 },
  left:  { y: 0, x: 40 },
  right: { y: 0, x: -40 },
  none:  { y: 0, x: 0 },
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  once = true,
  margin = '-8% 0px',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: margin as Parameters<typeof useInView>[1] extends { margin?: infer M } ? M : never })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...dirMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface StaggerGridProps {
  children: React.ReactNode[]
  className?: string
  itemClassName?: string
  staggerDelay?: number
  baseDelay?: number
}

export function StaggerGrid({ children, className, itemClassName, staggerDelay = 0.08, baseDelay = 0 }: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <div ref={ref} className={cn(className)}>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: baseDelay + i * staggerDelay, ease: [0.16, 1, 0.3, 1] }}
          className={cn(itemClassName)}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
