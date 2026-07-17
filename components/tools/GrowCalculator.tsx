'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface CalcResult {
  colonizationTime: string
  fruitingWindow: string
  expectedYield: string
  tips: string[]
}

const SPECIES_OPTIONS = [
  { value: 'blue-oyster', label: 'Blue Oyster', colMin: 2, colMax: 3, tempMin: 55, tempMax: 65, efficiency: 0.25 },
  { value: 'lions-mane', label: "Lion's Mane", colMin: 3, colMax: 4, tempMin: 65, tempMax: 75, efficiency: 0.175 },
  { value: 'shiitake', label: 'Shiitake', colMin: 8, colMax: 12, tempMin: 55, tempMax: 75, efficiency: 0.5 },
  { value: 'reishi', label: 'Reishi', colMin: 12, colMax: 16, tempMin: 70, tempMax: 80, efficiency: 0.075 },
  { value: 'wine-cap', label: 'Wine Cap', colMin: 4, colMax: 6, tempMin: 50, tempMax: 70, efficiency: 0.3 },
]

const SUBSTRATE_OPTIONS = [
  { value: 'hardwood-sawdust', label: 'Hardwood Sawdust' },
  { value: 'straw', label: 'Straw' },
  { value: 'supplemented-sawdust', label: 'Supplemented Sawdust (+20% yield)' },
  { value: 'coffee-grounds', label: 'Coffee Grounds' },
  { value: 'wood-chips', label: 'Wood Chips (outdoor)' },
]

export function GrowCalculator() {
  const t = useTranslations('tools.calculator')

  const [species, setSpecies] = useState('')
  const [substrate, setSubstrate] = useState('')
  const [weight, setWeight] = useState('')
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs')
  const [temp, setTemp] = useState('')
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F')
  const [humidity, setHumidity] = useState('90')
  const [result, setResult] = useState<CalcResult | null>(null)

  const calculate = () => {
    const sp = SPECIES_OPTIONS.find((s) => s.value === species)
    if (!sp || !weight) return

    const weightKg = unit === 'lbs' ? parseFloat(weight) * 0.453592 : parseFloat(weight)
    const currentTemp = tempUnit === 'C' ? parseFloat(temp) * 9 / 5 + 32 : parseFloat(temp)
    const supplementBonus = substrate === 'supplemented-sawdust' ? 1.2 : 1

    // Adjust colonization based on temperature
    const tempFactor = currentTemp < sp.tempMin ? 1.3 : currentTemp > sp.tempMax ? 1.4 : 1
    const adjColMin = Math.round(sp.colMin * tempFactor)
    const adjColMax = Math.round(sp.colMax * tempFactor)

    const yieldGrams = Math.round(weightKg * 1000 * sp.efficiency * supplementBonus)
    const humidityNum = parseFloat(humidity)

    const tips: string[] = []
    if (currentTemp < sp.tempMin) tips.push(`Temperature is below ideal range (${sp.tempMin}–${sp.tempMax}°F). Colonization will be slower.`)
    if (currentTemp > sp.tempMax) tips.push(`Temperature is above ideal range. Risk of contamination increases.`)
    if (humidityNum < 80) tips.push('Humidity is below 80%. Increase misting frequency or use a humidity tent.')
    if (humidityNum > 95) tips.push('Humidity above 95% may cause bacterial blotch. Ensure fresh air exchange.')
    if (substrate === 'coffee-grounds') tips.push('Coffee grounds have high contamination risk. Sterilize thoroughly and work fast.')
    if (tips.length === 0) tips.push('Conditions look great! Maintain consistency for best results.')

    setResult({
      colonizationTime: `${adjColMin}–${adjColMax} weeks`,
      fruitingWindow: `${adjColMin + 1}–${adjColMax + 2} weeks from today`,
      expectedYield: `${yieldGrams}g (~${Math.round(yieldGrams / 453.6 * 10) / 10} lbs)`,
      tips,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-5">
        {/* Species */}
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">{t('species')}</label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          >
            <option value="">Select species...</option>
            {SPECIES_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Substrate */}
        <div>
          <label className="block text-sm font-medium text-cream-muted mb-1.5">{t('substrate')}</label>
          <select
            value={substrate}
            onChange={(e) => setSubstrate(e.target.value)}
            className="w-full bg-surface border border-ds-border rounded-xl px-4 py-3 text-cream font-body text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
          >
            <option value="">Select substrate...</option>
            {SUBSTRATE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label={t('weight')}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 5"
              min="0.1"
              step="0.1"
            />
          </div>
          <div className="pt-7">
            <div className="flex rounded-xl border border-ds-border overflow-hidden">
              {(['lbs', 'kg'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${unit === u ? 'bg-accent text-cream' : 'bg-surface text-cream-muted hover:text-cream'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              label={t('temperature')}
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder={tempUnit === 'F' ? 'e.g. 70' : 'e.g. 21'}
            />
          </div>
          <div className="pt-7">
            <div className="flex rounded-xl border border-ds-border overflow-hidden">
              {(['°F', '°C'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setTempUnit(u === '°F' ? 'F' : 'C')}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${tempUnit === (u === '°F' ? 'F' : 'C') ? 'bg-accent text-cream' : 'bg-surface text-cream-muted hover:text-cream'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Humidity */}
        <Input
          label={t('humidity')}
          type="number"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          placeholder="e.g. 90"
          min="0"
          max="100"
        />

        <Button onClick={calculate} size="lg" disabled={!species || !substrate || !weight}>
          {t('calculate')}
        </Button>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-elevated rounded-2xl border border-ds-border p-6 space-y-5 animate-fade-in">
          <h3 className="font-heading text-xl font-semibold text-cream">{t('results.title')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: t('results.colonizationTime'), value: result.colonizationTime, icon: '🕐' },
              { label: t('results.fruitingWindow'), value: result.fruitingWindow, icon: '🌱' },
              { label: t('results.expectedYield'), value: result.expectedYield, icon: '⚖️' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface rounded-xl p-4 border border-ds-border">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-xs text-cream-muted uppercase tracking-wide mb-1">{stat.label}</p>
                <p className="font-heading font-semibold text-cream">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-cream-muted">{t('results.tips')}</p>
            {result.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-moss mt-0.5 flex-shrink-0">✓</span>
                <p className="text-sm text-cream-muted">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
