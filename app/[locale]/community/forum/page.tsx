import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const CATEGORIES = [
  { key: 'beginners', icon: '🌱', count: 234, color: 'moss' as const },
  { key: 'cultivation', icon: '🍄', count: 891, color: 'success' as const },
  { key: 'identification', icon: '🔍', count: 345, color: 'warning' as const },
  { key: 'science', icon: '🔬', count: 127, color: 'accent' as const },
  { key: 'recipes', icon: '🍳', count: 203, color: 'default' as const },
]

export default function ForumPage() {
  const t = useTranslations('community.forum')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-cream">{t('title')}</h1>
            <p className="text-cream-muted mt-1">{t('subtitle')}</p>
          </div>
          <Button>{t('newPost')}</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-5 p-5 bg-elevated rounded-2xl border border-ds-border hover:border-accent/30 transition-colors cursor-pointer group"
            >
              <span className="text-3xl flex-shrink-0">{cat.icon}</span>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-cream group-hover:text-accent transition-colors">
                  {t(`categories.${cat.key}`)}
                </h3>
                <p className="text-sm text-cream-muted">{cat.count} posts</p>
              </div>
              <Badge variant={cat.color}>{cat.count}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
