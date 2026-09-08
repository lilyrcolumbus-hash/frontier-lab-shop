import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Button } from '@/components/ui/Button'

const CATEGORIES = [
  { key: 'beginners', icon: '🌱' },
  { key: 'cultivation', icon: '🍄' },
  { key: 'identification', icon: '🔍' },
  { key: 'science', icon: '🔬' },
  { key: 'recipes', icon: '🍳' },
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
              className="flex items-center gap-5 p-5 bg-elevated rounded-none border border-ds-border hover:border-accent/30 transition-colors cursor-pointer group"
            >
              <span className="text-3xl flex-shrink-0">{cat.icon}</span>
              <div className="flex-1">
                <h3 className="font-heading text-lg font-semibold text-cream group-hover:text-accent transition-colors">
                  {t(`categories.${cat.key}`)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
