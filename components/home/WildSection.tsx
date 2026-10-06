'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'

const PHOTO_IDS = ['1', '2', '3'] as const
const PHOTO_SPANS = ['row-span-2', '', ''] as const
const TAG_IDS = ['tag1', 'tag2', 'tag3', 'tag4'] as const

export function WildSection() {
  const t = useTranslations('home.wild')
  const photos = PHOTO_IDS.map((id, i) => ({
    src: t(`photos.${id}.image`),
    alt: t(`photos.${id}.alt`),
    label: t(`photos.${id}.label`),
    span: PHOTO_SPANS[i],
  }))
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
              src={t('bgImage')}
              alt={t('bgAlt')}
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
            <div className="glass-warm rounded-none px-5 py-4 border border-amber/20 max-w-[220px]">
              <p className="font-mono text-[10px] text-amber/60 uppercase tracking-widest mb-1">{t('badgeLabel')}</p>
              <p className="font-body text-cream text-sm font-medium leading-snug">
                {t('badgeText')}
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
                {t('eyebrow')}
              </div>
              <h2 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight leading-tight">
                {t('titleLine1')}
                <br />
                <span style={{ color: '#C4883A' }}>{t('titleLine2')}</span>
              </h2>
              <p className="font-body text-cream-muted text-lg leading-relaxed max-w-md">
                {t('body')}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {TAG_IDS.map((id) => (
                  <span
                    key={id}
                    className="text-xs font-mono px-3 py-1.5 rounded-none border border-accent/25 text-accent/80"
                  >
                    {t(id)}
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
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  className={`group relative overflow-hidden rounded-none border border-ds-border ${photo.span}`}
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
