'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=700&h=900&q=88&auto=format&fit=crop',
    alt: 'Pink Oyster cluster',
    label: 'Pink Oyster',
    span: 'row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600&h=400&q=88&auto=format&fit=crop',
    alt: 'Blue Oyster mushroom cluster',
    label: 'Blue Oyster',
    span: '',
  },
  {
    src: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=600&h=400&q=88&auto=format&fit=crop',
    alt: 'Yellow Oyster golden cluster',
    label: 'Yellow Oyster',
    span: '',
  },
]

export function WildSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-12% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg py-0"
    >
      <div className="grid lg:grid-cols-2 min-h-[700px]">

        {/* LEFT — cinematic photo with parallax */}
        <div className="relative overflow-hidden min-h-[500px] lg:min-h-[700px]">
          <motion.div
            className="absolute inset-0"
            style={{ y: bgY }}
          >
            <img
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&h=900&q=85&auto=format&fit=crop"
              alt="Enchanted dark forest with light rays"
              className="w-full h-full object-cover scale-110"
            />
          </motion.div>
          {/* Darken overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg/10 via-transparent to-bg/80 lg:to-bg/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />

          {/* Video badge overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute bottom-10 left-8"
          >
            <div className="glass-warm rounded-2xl px-5 py-4 border border-amber/20 max-w-[220px]">
              <p className="font-mono text-[10px] text-amber/60 uppercase tracking-widest mb-1">In the wild</p>
              <p className="font-body text-cream text-sm font-medium leading-snug">
                Found in Ohio forests, October — Hen of the Woods
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — text + photo grid */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16 lg:py-20 bg-bg">
          <div ref={textRef}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 mb-10"
            >
              <div className="flex items-center gap-3 text-amber/60 font-mono text-xs uppercase tracking-[0.25em]">
                <div className="w-8 h-px bg-amber/40" />
                Born Wild
              </div>
              <h2 className="font-body font-bold text-3xl sm:text-4xl text-cream tracking-tight leading-tight">
                Grown in the Dark,
                <br />
                <span style={{ color: '#C4883A' }}>Born in the Wild</span>
              </h2>
              <p className="font-body text-cream-muted text-lg leading-relaxed max-w-md">
                From Ohio forest floors to substrate jars — we grow what nature grows, the way nature grows it.
                No shortcuts, no synthetics, just mycelium doing what mycelium does.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {['100% organic', 'No chemicals', 'Zone 6a grown', 'Heirloom strains'].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1.5 rounded-full border border-accent/25 text-accent/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Mini photo grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="grid grid-cols-3 gap-3"
            >
              {PHOTOS.map((photo, i) => (
                <motion.div
                  key={photo.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className={`group relative overflow-hidden rounded-xl border border-ds-border ${photo.span}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover min-h-[100px] transition-transform duration-600 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <span className="text-[10px] font-mono text-cream/80">{photo.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
