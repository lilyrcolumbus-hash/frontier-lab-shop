import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const reviewSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(2000),
  productName: z.string().trim().max(200).optional(),
  locale: z.enum(['en', 'es']).default('en'),
})

const REVIEW_DISCOUNT_CODE = 'REVIEW15'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = reviewSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid review data' }, { status: 400 })
  }

  try {
    await prisma.review.create({ data: parsed.data })
    return NextResponse.json({ code: REVIEW_DISCOUNT_CODE })
  } catch (err) {
    console.error('Failed to save review', err)
    return NextResponse.json({ error: 'Could not save your review' }, { status: 500 })
  }
}
