'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STEP_IDS = ['1', '2', '3', '4'] as const

export function GrowJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })
  const t = useTranslations('home.journey')
  const steps = STEP_IDS.map((id) => ({
    step: `0${id}`,
    phase: t(`steps.${id}.phase`),
    title: t(`steps.${id}.title`),
    description: t(`steps.${id}.description`),
    timing: t(`steps.${id}.timing`),
    src: t(`steps.${id}.image`),
    alt: t(`steps.${id}.imageAlt`),
  }))

  return (
    <section className="py-28 bg-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-amber/[0.025] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-accent/[0.025] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 mb-5 text-amber/60 font-mono text-xs uppercase tracking-[0.28em]">
            <div className="w-10 h-px bg-amber/30" />
            {t('eyebrow')}
            <div className="w-10 h-px bg-amber/30" />
          </div>
          <h2 className="font-heading font-medium text-3xl sm:text-4xl text-cream tracking-tight leading-tight">
            {t('title')}
          </h2>
          <p className="text-cream-muted mt-4 text-lg max-w-lg mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Connector dot + line between steps (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-[108px] left-full z-10 items-center w-5">
                  <div className="w-full h-px bg-gradient-to-r from-amber/30 to-transparent" />
                </div>
              )}

              <div className="relative overflow-hidden rounded-none border border-ds-border bg-bg transition-all duration-500 group-hover:border-amber/30 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                {/* Photo */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={step.src}
                    alt={step.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ '--tw-scale-x': '1.08', '--tw-scale-y': '1.08' } as React.CSSProperties}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />

                  {/* Step badge */}
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-none glass-warm border border-amber/20 flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-amber">{step.step}</span>
                  </div>

                  {/* Timing */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-none bg-bg/80 border border-ds-border/80 backdrop-blur-sm">
                    <span className="font-mono text-[10px] text-cream-muted/70">{step.timing}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <p className="text-[10px] font-mono text-amber/55 uppercase tracking-wider">{step.phase}</p>
                  <h3 className="font-body text-base font-semibold text-cream leading-snug">
                    {step.title}
                  </h3>
                  <p className="font-body text-cream-muted/65 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom amber glow on hover */}
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
