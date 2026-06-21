import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

export default function CommunityPage() {
  const t = useTranslations('community')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-3">{t('title')}</h1>
        <p className="text-cream-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/community/gallery">
            <Card hover className="h-full">
              <CardBody className="text-center py-10">
                <span className="text-5xl block mb-4">📸</span>
                <h2 className="font-heading text-2xl font-semibold text-cream mb-2">{t('gallery.title')}</h2>
                <p className="text-cream-muted">{t('gallery.subtitle')}</p>
              </CardBody>
            </Card>
          </Link>
          <Link href="/community/forum">
            <Card hover className="h-full">
              <CardBody className="text-center py-10">
                <span className="text-5xl block mb-4">💬</span>
                <h2 className="font-heading text-2xl font-semibold text-cream mb-2">{t('forum.title')}</h2>
                <p className="text-cream-muted">{t('forum.subtitle')}</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
