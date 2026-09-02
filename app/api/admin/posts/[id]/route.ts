import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { postSchema } from '@/lib/post-schema'

const updateSchema = postSchema.omit({ slug: true })

export const PATCH = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const body = await req.json().catch(() => null)
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid post', details: parsed.error.flatten() }, { status: 400 })
    }

    const existing = await prisma.post.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        // Keep the original publication date once set — re-publishing is not a new article.
        publishedAt:
          parsed.data.status === 'active' ? existing.publishedAt ?? new Date() : existing.publishedAt,
      },
    })
    revalidatePath('/', 'layout')
    return NextResponse.json({ post })
  },
  { requireOwner: true }
)

export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (_req, { store }, { params }) => {
    const existing = await prisma.post.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.post.delete({ where: { id: params.id } })
    revalidatePath('/', 'layout')
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
