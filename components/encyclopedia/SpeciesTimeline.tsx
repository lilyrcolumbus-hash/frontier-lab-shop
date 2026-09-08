import { useTranslations } from 'next-intl'

interface TimelineStep {
  key: 'inoculation' | 'colonization' | 'fruiting' | 'harvest'
  duration: string
  description: string
  icon: string
}

interface SpeciesTimelineProps {
  steps: TimelineStep[]
}

const stepColors = {
  inoculation: 'border-accent bg-accent/10 text-accent',
  colonization: 'border-moss bg-moss/10 text-moss',
  fruiting: 'border-warning bg-warning/10 text-warning',
  harvest: 'border-success bg-success/10 text-success',
}

export function SpeciesTimeline({ steps }: SpeciesTimelineProps) {
  const t = useTranslations('encyclopedia.species.cultivation')

  return (
    <div>
      <h3 className="font-heading text-2xl font-semibold text-cream mb-8">
        {t('timeline')}
      </h3>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-12 bottom-0 w-px bg-ds-border hidden sm:block" aria-hidden="true" />

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={step.key} className="relative flex gap-6">
              {/* Icon node */}
              <div
                className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl ${stepColors[step.key]}`}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-cream-muted mb-1">
                      Step {i + 1}
                    </p>
                    <h4 className="font-heading text-xl font-semibold text-cream">
                      {t(step.key)}
                    </h4>
                  </div>
                  <span className="flex-shrink-0 text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded-none">
                    {step.duration}
                  </span>
                </div>
                <p className="text-cream-muted mt-2 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
