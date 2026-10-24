import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

// Photos are attached to the product the moment they finish uploading, so a photo is never
// lost just because the form was closed or reloaded before "Save changes". It only appends
// (never replaces), so it cannot wipe photos that are already there.
const STORAGE_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/`

const appendImagesSchema = z.object({
  urls: z.array(z.string().startsWith(STORAGE_PREFIX)).min(1).max(20),
})

export const POST = withStoreAdmin<{ params: { id: string } }>(async (req, { store }, { params }) => {
  const body = await req.json().catch(() => null)
  const parsed = appendImagesSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid image list' }, { status: 400 })

  const existing = await prisma.product.findUnique({ where: { id: params.id }, select: { storeId: true } })
  if (!existing || existing.storeId !== store.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  try {
    await prisma.product.update({
      where: { id: params.id },
      data: {
        images: { push: parsed.data.urls },
        imageAlts: { push: parsed.data.urls.map(() => '') },
      },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Could not attach uploaded images', params.id, err)
    return NextResponse.json({ error: 'Could not attach the images' }, { status: 500 })
  }
})
