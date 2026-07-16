'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface VideoMomentProps {
  src: string
  eyebrow: string
  headline: string
  subtext?: string
  align?: 'left' | 'center'
}

export function VideoMoment({ src, eyebrow, headline, subtext, align = 'left' }: VideoMomentProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative h-[78vh] min-h-[480px] max-h-[820px] overflow-hidden bg-bg">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Dark overlay — same treatment as the hero, lets video show through */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(110deg, rgba(4,9,4,0.80) 0%, rgba(4,9,4,0.52) 45%, rgba(4,9,4,0.30) 100%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040904]/70 via-transparent to-[#040904]/20" />

      <div className={`relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-end pb-14 sm:pb-16 ${align === 'center' ? 'justify-center text-center' : 'justify-start text-left'}`}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={align === 'center' ? 'max-w-2xl' : 'max-w-xl'}
        >
          <p className="font-mono text-[11px] text-white/50 uppercase tracking-[0.28em] mb-3">{eyebrow}</p>
          <h2 className="font-body font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-white tracking-tight leading-[1.05] text-wrap-balance">
            {headline}
          </h2>
          {subtext && (
            <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed mt-4 max-w-md">
              {subtext}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
