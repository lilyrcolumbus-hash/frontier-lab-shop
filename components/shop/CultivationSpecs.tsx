import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import type { CultivationSpecs as CultivationSpecsType } from '@/types/product'

interface CultivationSpecsProps {
  specs: CultivationSpecsType
}

export function CultivationSpecs({ specs }: CultivationSpecsProps) {
  const t = useTranslations('shop.product.specs')

  const rows = [
    { label: t('colonization'), value: specs.colonizationTime, icon: '🕐' },
    { label: t('fruitingTemp'), value: `${specs.fruitingTempF} / ${specs.fruitingTempC}`, icon: '🌡️' },
    { label: t('substrate'), value: specs.idealSubstrate, icon: '🪵' },
    { label: t('yield'), value: specs.expectedYield, icon: '📦' },
    { label: t('method'), value: specs.indoorOutdoor === 'indoor' ? 'Indoor' : specs.indoorOutdoor === 'outdoor' ? 'Outdoor' : 'Indoor & Outdoor', icon: '🏠' },
  ]

  return (
    <div className="bg-elevated rounded-2xl border border-ds-border p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-heading text-lg font-semibold text-cream">{t('title')}</h3>
        <Badge
          variant={
            specs.difficulty === 'beginner' ? 'success' :
            specs.difficulty === 'intermediate' ? 'warning' : 'error'
          }
        >
          {specs.difficulty.charAt(0).toUpperCase() + specs.difficulty.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start gap-3 py-3 border-b border-ds-border last:border-b-0"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{row.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-cream-muted uppercase tracking-wide">{row.label}</p>
              <p className="text-sm text-cream font-medium mt-0.5">{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
