'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { MyeliumCanvas } from '@/components/home/MyeliumCanvas'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
})

export function Hero() {
  const t = useTranslations('home.hero')
  const tFooter = useTranslations('footer')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src={t('videoUrl')} type="video/mp4" />
        </video>
        {/* Dark overlay — lets video show through beautifully */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, rgba(4,9,4,0.91) 0%, rgba(4,9,4,0.84) 45%, rgba(4,9,4,0.66) 100%)' }}
        />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#050A04] to-transparent" />
        {/* Mycelium canvas — generative lines + spores */}
        <MyeliumCanvas />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-[1fr_400px] gap-16 xl:gap-24 items-center">

          {/* Left column */}
          <div className="space-y-8">
            <motion.p
              {...fadeUp(0.1)}
              className="text-[11px] font-mono font-medium text-white/40 uppercase tracking-[0.28em]"
            >
              {tFooter('tagline')}
            </motion.p>

            <div>
              <motion.h1
                className="font-heading text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-medium text-white leading-[1.0] tracking-[-0.025em]"
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 75, damping: 16, delay: 0.16 }}
              >
                {t('headline1')}
              </motion.h1>
              <motion.h1
                // The gold's bright variant, not the base hex: on near-black this is the one
                // moment gold is meant to be a headline colour, so it needs the lighter mix to
                // actually read against the dark hero rather than going muddy.
                className="font-heading text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-medium leading-[1.05] tracking-[-0.025em] text-amber-bright"
                initial={{ opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 75, damping: 16, delay: 0.3 }}
              >
                {t('headline2')}
              </motion.h1>
            </div>

            <motion.p {...fadeUp(0.38)} className="text-white/52 text-lg leading-relaxed max-w-[400px]">
              {t('subtext')}
            </motion.p>

            <motion.div {...fadeUp(0.50)} className="flex flex-wrap gap-3">
              <Link href="/quiz">
                <button className="inline-flex items-center gap-2 rounded-none bg-white text-[#0D1209] px-8 py-3.5 text-sm font-semibold hover:bg-white/90 transition-colors duration-200">
                  {t('ctaPrimary')}
                </button>
              </Link>
              <Link href="/shop">
                <button className="inline-flex items-center gap-2 rounded-none bg-transparent text-white/85 px-8 py-3.5 text-sm font-medium border border-white/18 hover:bg-white/[0.07] hover:border-white/32 transition-all duration-200">
                  {t('ctaSecondary')} →
                </button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.62)} className="flex items-center gap-5 pt-1">
              <p className="text-sm text-white/38">{t('socialProof')}</p>
            </motion.div>
          </div>

          {/* Right column — clean product photo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.28, ease: EASE }}
            className="hidden lg:block"
          >
            {/* Main photo */}
            <div className="relative rounded-none overflow-hidden" style={{ height: 520 }}>
              <img
                src={t('featuredImage')}
                alt={t('featuredAlt')}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040904]/88 via-[#040904]/18 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7">
                <p className="text-white/32 text-[10px] font-mono uppercase tracking-[0.22em] mb-1.5">
                  {t('featuredLabel')}
                </p>
                <p className="text-white text-xl font-semibold tracking-tight">{t('featuredName')}</p>
                <p className="text-white/32 text-sm italic mt-0.5">{t('featuredLatin')}</p>
              </div>
            </div>

            {/* Two mini stat chips below photo */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {[
                { label: t('chip1Label'), value: t('chip1Value') },
                { label: t('chip2Label'), value: t('chip2Value') },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-none px-4 py-3 border border-white/7"
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)' }}
                >
                  <p className="text-white/32 text-[10px] font-mono uppercase tracking-wider">{stat.label}</p>
                  <p className="text-white text-sm font-semibold mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/22 text-[10px] font-mono tracking-[0.28em] uppercase">{t('scroll')}</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/22 to-transparent" />
      </motion.div>
    </section>
  )
}
