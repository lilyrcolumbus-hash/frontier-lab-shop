import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

const GUIDES = [
  { slug: 'beginners-guide-oyster-mushrooms', category: 'beginners', title: "The Complete Beginner's Guide to Growing Oyster Mushrooms", readTime: 12, image: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600' },
  { slug: 'understanding-mycelium', category: 'science', title: 'Understanding Mycelium: The Underground Network', readTime: 8, image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=600' },
  { slug: 'lions-mane-cognitive-benefits', category: 'science', title: "Lion's Mane & Brain Health: What the Science Says", readTime: 15, image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600' },
  { slug: 'outdoor-wine-cap-guide', category: 'outdoor', title: 'Growing Wine Cap in Your Garden: The No-Fail Method', readTime: 10, image: 'https://images.unsplash.com/photo-1541904031027-00d5c22f7cf2?w=600' },
  { slug: 'shiitake-log-inoculation', category: 'outdoor', title: 'How to Inoculate Oak Logs with Shiitake: Step by Step', readTime: 20, image: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa12?w=600' },
  { slug: 'reishi-dual-extract', category: 'lab', title: 'Making Your Own Reishi Dual-Extract Tincture at Home', readTime: 18, image: 'https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=600' },
]

const CATEGORY_COLORS: Record<string, 'moss' | 'accent' | 'warning' | 'success' | 'default'> = {
  beginners: 'success',
  science: 'accent',
  outdoor: 'moss',
  lab: 'warning',
  indoor: 'default',
  recipes: 'default',
}

export default function LearnPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <p className="font-body font-light uppercase tracking-[0.2em] text-moss text-sm mb-3">DirtyShrooms Academy</p>
        <h1 className="font-heading text-5xl sm:text-6xl font-bold text-cream mb-3">Get Filthy Smart</h1>
        <p className="text-cream-muted text-lg">Expert guides written by cultivators, for cultivators.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/learn/${guide.slug}`}>
              <Card hover className="overflow-hidden h-full flex flex-col group">
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <img src={guide.image} alt={guide.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge variant={CATEGORY_COLORS[guide.category] ?? 'default'} size="sm">{guide.category}</Badge>
                    <span className="text-xs text-cream-muted">{guide.readTime} min read</span>
                  </div>
                  <h2 className="font-heading text-lg font-semibold text-cream leading-snug group-hover:text-accent transition-colors">{guide.title}</h2>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
