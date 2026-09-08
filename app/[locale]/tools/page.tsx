import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Card, CardBody } from '@/components/ui/Card'

const TOOLS = [
  { slug: 'grow-calculator', icon: '🧮', key: 'calculator' as const, color: 'bg-accent/10 border-accent/20' },
  { slug: 'grow-journal', icon: '📔', key: 'journal' as const, color: 'bg-moss/10 border-moss/20' },
  { slug: 'species-finder', icon: '🔍', key: 'finder' as const, color: 'bg-warning/10 border-warning/20' },
]

export default function ToolsPage() {
  const t = useTranslations('tools')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-3">{t('title')}</h1>
        <p className="text-cream-muted text-lg">{t('subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
              <Card hover className="h-full">
                <CardBody className="text-center py-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-none border ${tool.color} text-4xl mb-4`}>
                    {tool.icon}
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-cream mb-2">
                    {t(`${tool.key}.title`)}
                  </h2>
                  <p className="text-sm text-cream-muted">{t(`${tool.key}.subtitle`)}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
