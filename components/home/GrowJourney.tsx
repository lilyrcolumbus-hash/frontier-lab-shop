'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const STEPS = [
  {
    step: '01',
    phase: 'Prepare',
    title: 'Substrate & Spawn',
    description:
      'Mix sterilized substrate with grain spawn under sterile conditions. Rye berries, straw, or sawdust — every species has its ideal medium.',
    timing: 'Day 1',
    src: 'https://images.unsplash.com/photo-1726177972571-0427e1d7d9db?w=520&h=620&q=85&auto=format&fit=crop',
    alt: 'Blue oyster mushroom cluster on substrate',
  },
  {
    step: '02',
    phase: 'Colonize',
    title: 'Mycelium Takeover',
    description:
      "In the dark, white threads spread through the substrate, building the underground network. Don't touch it. Just wait.",
    timing: 'Weeks 1–3',
    src: 'https://images.unsplash.com/photo-1726177972571-0427e1d7d9db?w=520&h=620&q=85&auto=format&fit=crop',
    alt: 'Blue oyster mushroom cluster colonizing',
  },
  {
    step: '03',
    phase: 'Fruit',
    title: 'Pins Break Through',
    description:
      'Lower CO₂, raise humidity. Tiny pins push through the surface. The moment life emerges from nothing — always magical.',
    timing: 'Week 3–4',
    src: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=520&h=620&q=85&auto=format&fit=crop',
    alt: 'Pink Oyster pins emerging',
  },
  {
    step: '04',
    phase: 'Harvest',
    title: 'The Pure Harvest',
    description:
      "Twist and pull just before the veil breaks. First flush — pure reward for your precision and patience. Plate it. Extract it. Grow again.",
    timing: 'Week 4–5',
    src: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=520&h=620&q=85&auto=format&fit=crop',
    alt: 'Golden Oyster ready to harvest',
  },
]

export function GrowJourney() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

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
            The Journey
            <div className="w-10 h-px bg-amber/30" />
          </div>
          <h2 className="font-body font-bold text-3xl sm:text-4xl text-cream tracking-tight leading-tight">
            Spore to Table
          </h2>
          <p className="text-cream-muted mt-4 text-lg max-w-lg mx-auto leading-relaxed">
            Every harvest begins with precision. Follow the journey from inoculation to your plate.
          </p>
        </ScrollReveal>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="group relative"
            >
              {/* Connector dot + line between steps (desktop) */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-[108px] left-full z-10 items-center w-5">
                  <div className="w-full h-px bg-gradient-to-r from-amber/30 to-transparent" />
                </div>
              )}

              <div className="relative overflow-hidden rounded-2xl border border-ds-border bg-bg transition-all duration-500 group-hover:border-amber/30 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
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
                  <div className="absolute top-4 left-4 w-9 h-9 rounded-xl glass-warm border border-amber/20 flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-amber">{step.step}</span>
                  </div>

                  {/* Timing */}
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-bg/80 border border-ds-border/80 backdrop-blur-sm">
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
