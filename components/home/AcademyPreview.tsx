import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const PREVIEW_ARTICLES = [
  {
    slug: 'beginners-guide-oyster-mushrooms',
    category: 'For Beginners',
    title: 'The Complete Beginner\'s Guide to Growing Oyster Mushrooms',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600',
  },
  {
    slug: 'understanding-mycelium',
    category: 'Mushroom Science',
    title: 'Understanding Mycelium: The Underground Network That Changes Everything',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600',
  },
  {
    slug: 'lions-mane-cognitive-benefits',
    category: 'Health & Wellness',
    title: "Lion's Mane & Brain Health: What the Science Actually Says",
    readTime: 15,
    image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600',
  },
]

export function AcademyPreview() {
  const t = useTranslations('home.academy')
  const tc = useTranslations('common')

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-2">
              DirtyShrooms Academy
            </p>
            <h2 className="font-heading text-4xl sm:text-5xl text-cream font-bold">
              {t('title')}
            </h2>
          </div>
          <Link
            href="/learn"
            className="hidden sm:block text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREVIEW_ARTICLES.map((article) => (
            <Link key={article.slug} href={`/learn/${article.slug}`}>
              <Card hover className="overflow-hidden h-full group">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="moss" size="sm">{article.category}</Badge>
                    <span className="text-xs text-cream-muted">{article.readTime} {tc('readTime')}</span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-cream leading-snug group-hover:text-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-accent font-medium mt-auto flex items-center gap-1">
                    Read article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/learn"
            className="text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}
