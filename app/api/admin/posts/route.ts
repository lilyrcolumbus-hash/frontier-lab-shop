import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { postSchema } from '@/lib/post-schema'

export const GET = withStoreAdmin(async (_req, { store }) => {
  const posts = await prisma.post.findMany({
    where: { storeId: store.id },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json({ posts })
})

export const POST = withStoreAdmin(
  async (req, { store }) => {
    const body = await req.json().catch(() => null)
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid post', details: parsed.error.flatten() }, { status: 400 })
    }

    const existing = await prisma.post.findFirst({ where: { storeId: store.id, slug: parsed.data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'A post with this address already exists' }, { status: 409 })
    }

    const post = await prisma.post.create({
      data: {
        ...parsed.data,
        storeId: store.id,
        // Publishing stamps the date once; it is what the blog orders by.
        publishedAt: parsed.data.status === 'active' ? new Date() : null,
      },
    })
    revalidatePath('/', 'layout')
    return NextResponse.json({ post })
  },
  { requireOwner: true }
)
