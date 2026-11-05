import type { Guide } from '@/lib/guide'

export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
}

export interface CultivationSpecs {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  colonizationTime: string
  fruitingTempF: string
  fruitingTempC: string
  idealSubstrate: string
  expectedYield: string
  indoorOutdoor: 'indoor' | 'outdoor' | 'both'
}

export interface Product {
  id: string
  slug: string
  name: Record<'en' | 'es', string>
  description: Record<'en' | 'es', string>
  /** Slug of the category in the tree managed in /admin/categories, e.g. 'substrate'. */
  category: string
  subcategory: string
  /** Slug of the subcategory in the tree (for the sub-filter pills). */
  subcategorySlug?: string
  /** Display names from the category tree, when the product is linked to it. */
  categoryName?: Record<'en' | 'es', string>
  subcategoryName?: Record<'en' | 'es', string>
  /** Product-page blocks, already resolved from the category tree (subcategory first, then its category). */
  blocks?: { packetContents: boolean; viabilityGuarantee: boolean; freshness: boolean }
  species?: string
  scientificName?: string
  price: number
  compareAtPrice?: number
  variants: ProductVariant[]
  images: string[]
  /** Alt text, index-aligned with `images`; may be shorter or hold empty strings. */
  imageAlts?: string[]
  cultivationSpecs?: CultivationSpecs
  isOrganic: boolean
  inStock: boolean
  tags: string[]
  relatedProducts: string[]
  howToUseSteps?: string[]
  faqs?: { q: Record<'en' | 'es', string>; a: Record<'en' | 'es', string> }[]
  scienceContent?: Record<'en' | 'es', string>
  keyBenefits?: { icon: 'brain' | 'shield' | 'heart' | 'leaf' | 'activity' | 'zap' | 'sun' | 'droplet'; label: string; detail: string }[]
  grainBagSpecs?: {
    bagSize: string
    sterilization: string
    moisture: string
    colonizationEstimate: string
    recommendedInoculation: string
    shelfLife: string
  }
  guide?: Guide
}

export interface CartItem {
  productId: string
  variantId: string
  name: string
  price: number
  quantity: number
  image: string
}
