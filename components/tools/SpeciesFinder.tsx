'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface FinderState {
  location: string
  level: string
  goal: string
  climate: string
}

interface SpeciesMatch {
  slug: string
  name: string
  scientificName: string
  image: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  reason: string
}

function getMatches(state: FinderState): SpeciesMatch[] {
  const all: (SpeciesMatch & { score: number })[] = [
    {
      slug: 'blue-oyster', name: 'Blue Oyster', scientificName: 'Pleurotus ostreatus',
      image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400',
      difficulty: 'beginner',
      reason: 'Fast, forgiving, and thrives in most conditions. Perfect first grow.',
      score: 0,
    },
    {
      slug: 'lions-mane', name: "Lion's Mane", scientificName: 'Hericium erinaceus',
      image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=400',
      difficulty: 'intermediate',
      reason: 'Best brain-boosting mushroom. Incredible flavor for foodies too.',
      score: 0,
    },
    {
      slug: 'shiitake', name: 'Shiitake', scientificName: 'Lentinula edodes',
      image: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=400',
      difficulty: 'intermediate',
      reason: "World's most beloved edible mushroom. Grows indoors or on outdoor logs.",
      score: 0,
    },
    {
      slug: 'reishi', name: 'Reishi', scientificName: 'Ganoderma lucidum',
      image: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=400',
      difficulty: 'advanced',
      reason: 'The ultimate medicinal mushroom. Rewarding for serious growers.',
      score: 0,
    },
    {
      slug: 'pink-oyster', name: 'Pink Oyster', scientificName: 'Pleurotus djamor',
      image: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=400',
      difficulty: 'beginner',
      reason: 'Fastest-fruiting mushroom available. Vivid pink color and mild flavor.',
      score: 0,
    },
  ]

  all.forEach((s) => {
    // Location scoring
    if (state.location === 'indoor' && s.slug !== 'pink-oyster') s.score += 2
    if (state.location === 'outdoor' && (s.slug === 'pink-oyster' || s.slug === 'shiitake')) s.score += 2
    if (state.location === 'both') s.score += 1

    // Level scoring
    if (state.level === 'beginner' && s.difficulty === 'beginner') s.score += 3
    if (state.level === 'some' && (s.difficulty === 'beginner' || s.difficulty === 'intermediate')) s.score += 2
    if (state.level === 'advanced') s.score += 1

    // Goal scoring
    if (state.goal === 'eat' && (s.slug === 'blue-oyster' || s.slug === 'shiitake' || s.slug === 'pink-oyster')) s.score += 2
    if (state.goal === 'health' && (s.slug === 'lions-mane' || s.slug === 'reishi')) s.score += 3
    if (state.goal === 'learn' && s.difficulty === 'beginner') s.score += 1
    if (state.goal === 'all') s.score += 1

    // Climate scoring
    if (state.climate === 'cold' && s.slug === 'blue-oyster') s.score += 2
    if (state.climate === 'temperate') s.score += 1
    if (state.climate === 'warm' && (s.slug === 'reishi' || s.slug === 'lions-mane')) s.score += 1
  })

  return all
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _, ...s }) => s)
}

const STEPS = ['step1', 'step2', 'step3', 'step4'] as const

export function SpeciesFinder() {
  const t = useTranslations('tools.finder')

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<FinderState>({
    location: '',
    level: '',
    goal: '',
    climate: '',
  })
  const [results, setResults] = useState<SpeciesMatch[] | null>(null)

  const keys = ['location', 'level', 'goal', 'climate'] as (keyof FinderState)[]

  const choose = (value: string) => {
    const key = keys[step]
    const newAnswers = { ...answers, [key]: value }
    setAnswers(newAnswers)

    if (step < 3) {
      setStep(step + 1)
    } else {
      setResults(getMatches(newAnswers))
    }
  }

  const reset = () => {
    setStep(0)
    setAnswers({ location: '', level: '', goal: '', climate: '' })
    setResults(null)
  }

  const Icon = ({ d, d2 }: { d: string; d2?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
      {d2 && <path d={d2} />}
    </svg>
  )

  const stepConfigs = [
    {
      question: t('step1.question'),
      options: [
        { value: 'indoor', label: t('step1.indoor'), icon: <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" d2="M9 22V12h6v10" /> },
        { value: 'outdoor', label: t('step1.outdoor'), icon: <Icon d="M17 8C8 10 5.9 16.17 3.82 19.16a2 2 0 0 0 1.57 3.11c.88.06 1.62-.49 2.04-1.22" d2="M12 3C8.13 3 5 6.13 5 10c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /> },
        { value: 'both', label: t('step1.both'), icon: <Icon d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" d2="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /> },
      ],
    },
    {
      question: t('step2.question'),
      options: [
        { value: 'beginner', label: t('step2.beginner'), icon: <Icon d="M12 22V12M12 12C12 12 7 10 7 5a5 5 0 0 1 10 0c0 5-5 7-5 7z" /> },
        { value: 'some', label: t('step2.some'), icon: <Icon d="M18 20V10M12 20V4M6 20v-6" /> },
        { value: 'advanced', label: t('step2.advanced'), icon: <Icon d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" /> },
      ],
    },
    {
      question: t('step3.question'),
      options: [
        { value: 'eat', label: t('step3.eat'), icon: <Icon d="M18 8h1a4 4 0 0 1 0 8h-1" d2="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /> },
        { value: 'health', label: t('step3.health'), icon: <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /> },
        { value: 'learn', label: t('step3.learn'), icon: <Icon d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" d2="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /> },
        { value: 'all', label: t('step3.all'), icon: <Icon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /> },
      ],
    },
    {
      question: t('step4.question'),
      options: [
        { value: 'cold', label: t('step4.cold'), icon: <Icon d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" /> },
        { value: 'temperate', label: t('step4.temperate'), icon: <Icon d="M18.36 6.64a9 9 0 1 1-12.73 0" d2="M12 2v10" /> },
        { value: 'warm', label: t('step4.warm'), icon: <Icon d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" d2="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" /> },
      ],
    },
  ]

  if (results) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="font-body font-bold text-3xl text-cream tracking-tight">{t('results.title')}</h2>
          <p className="text-cream-muted mt-2">{t('results.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {results.map((match, i) => (
            <div key={match.slug} className="flex gap-5 p-5 bg-elevated rounded-2xl border border-ds-border">
              <div className="flex-shrink-0 relative">
                <img src={match.image} alt={match.name} className="w-20 h-20 rounded-xl object-cover" />
                {i === 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs text-cream font-bold">
                    #1
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-body font-semibold text-xl text-cream">{match.name}</h3>
                    <p className="font-mono-lab text-xs text-cream-muted italic">{match.scientificName}</p>
                  </div>
                  <Badge variant={match.difficulty === 'beginner' ? 'success' : match.difficulty === 'intermediate' ? 'warning' : 'error'} size="sm">
                    {match.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-cream-muted mt-2">{match.reason}</p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/encyclopedia/${match.slug}`}>
                    <Button variant="outline" size="sm">{t('results.viewSpecies')}</Button>
                  </Link>
                  <Link href={`/shop?species=${match.slug}`}>
                    <Button size="sm">{t('results.shopProducts')}</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={reset} className="text-sm text-cream-muted hover:text-cream transition-colors">
            ← {t('results.startOver')}
          </button>
        </div>
      </div>
    )
  }

  const currentStep = stepConfigs[step]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex gap-2 mb-10">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1 rounded-full transition-colors duration-300',
              i <= step ? 'bg-accent' : 'bg-ds-border'
            )}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-moss mb-3">Step {step + 1} of 4</p>
        <h2 className="font-body font-bold text-3xl text-cream tracking-tight">{currentStep.question}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentStep.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => choose(opt.value)}
            className="flex items-center gap-4 p-5 bg-elevated hover:bg-surface border border-ds-border hover:border-accent/50 rounded-2xl transition-all group text-left"
          >
            <span className="flex-shrink-0 text-cream-muted/55 group-hover:text-accent transition-colors">{opt.icon}</span>
            <span className="font-body font-medium text-cream group-hover:text-accent transition-colors">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setStep(step - 1)}
            className="text-sm text-cream-muted hover:text-cream transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  )
}
