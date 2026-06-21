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
      image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400',
      difficulty: 'intermediate',
      reason: 'Best brain-boosting mushroom. Incredible flavor for foodies too.',
      score: 0,
    },
    {
      slug: 'shiitake', name: 'Shiitake', scientificName: 'Lentinula edodes',
      image: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=400',
      difficulty: 'intermediate',
      reason: "World's most beloved edible mushroom. Grows indoors or on outdoor logs.",
      score: 0,
    },
    {
      slug: 'reishi', name: 'Reishi', scientificName: 'Ganoderma lucidum',
      image: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400',
      difficulty: 'advanced',
      reason: 'The ultimate medicinal mushroom. Rewarding for serious growers.',
      score: 0,
    },
    {
      slug: 'wine-cap', name: 'Wine Cap', scientificName: 'Stropharia rugosoannulata',
      image: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=400',
      difficulty: 'beginner',
      reason: 'Sprinkle in garden beds and harvest abundantly for years. Zero effort.',
      score: 0,
    },
  ]

  all.forEach((s) => {
    // Location scoring
    if (state.location === 'indoor' && s.slug !== 'wine-cap') s.score += 2
    if (state.location === 'outdoor' && (s.slug === 'wine-cap' || s.slug === 'shiitake')) s.score += 2
    if (state.location === 'both') s.score += 1

    // Level scoring
    if (state.level === 'beginner' && s.difficulty === 'beginner') s.score += 3
    if (state.level === 'some' && (s.difficulty === 'beginner' || s.difficulty === 'intermediate')) s.score += 2
    if (state.level === 'advanced') s.score += 1

    // Goal scoring
    if (state.goal === 'eat' && (s.slug === 'blue-oyster' || s.slug === 'shiitake' || s.slug === 'wine-cap')) s.score += 2
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

  const stepConfigs = [
    {
      question: t('step1.question'),
      options: [
        { value: 'indoor', label: t('step1.indoor'), icon: '🏠' },
        { value: 'outdoor', label: t('step1.outdoor'), icon: '🌿' },
        { value: 'both', label: t('step1.both'), icon: '🌍' },
      ],
    },
    {
      question: t('step2.question'),
      options: [
        { value: 'beginner', label: t('step2.beginner'), icon: '🌱' },
        { value: 'some', label: t('step2.some'), icon: '🍄' },
        { value: 'advanced', label: t('step2.advanced'), icon: '🔬' },
      ],
    },
    {
      question: t('step3.question'),
      options: [
        { value: 'eat', label: t('step3.eat'), icon: '🍽️' },
        { value: 'health', label: t('step3.health'), icon: '💪' },
        { value: 'learn', label: t('step3.learn'), icon: '📚' },
        { value: 'all', label: t('step3.all'), icon: '✨' },
      ],
    },
    {
      question: t('step4.question'),
      options: [
        { value: 'cold', label: t('step4.cold'), icon: '❄️' },
        { value: 'temperate', label: t('step4.temperate'), icon: '🌤️' },
        { value: 'warm', label: t('step4.warm'), icon: '☀️' },
      ],
    },
  ]

  if (results) {
    return (
      <div className="max-w-3xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-cream">{t('results.title')}</h2>
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
                    <h3 className="font-heading text-xl font-semibold text-cream">{match.name}</h3>
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
        <h2 className="font-heading text-3xl font-bold text-cream">{currentStep.question}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentStep.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => choose(opt.value)}
            className="flex items-center gap-4 p-5 bg-elevated hover:bg-surface border border-ds-border hover:border-accent/50 rounded-2xl transition-all group text-left"
          >
            <span className="text-3xl flex-shrink-0">{opt.icon}</span>
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
