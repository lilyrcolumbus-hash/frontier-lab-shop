import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { withStoreAdmin } from '@/lib/with-store-admin'
import {
  GUIDE_BUCKET,
  GUIDE_IMAGE_TYPES,
  GUIDE_MAX_IMAGE_BYTES,
  GUIDE_MAX_VIDEO_BYTES,
  GUIDE_VIDEO_TYPES,
} from '@/lib/guide'

// Guide videos are too big to send through a Vercel function (about 4.5 MB per request), so the
// browser uploads straight to Supabase Storage. This route only checks the file type and size and
// hands back a one-time upload token for one file name.
const signSchema = z.object({
  fileName: z.string().trim().min(1).max(200),
  contentType: z.string().trim().min(1).max(100),
  size: z.number().int().min(1),
})

export const POST = withStoreAdmin(async (req) => {
  const body = await req.json().catch(() => null)
  const parsed = signSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 })

  const { fileName, contentType, size } = parsed.data
  const isImage = (GUIDE_IMAGE_TYPES as readonly string[]).includes(contentType)
  const isVideo = (GUIDE_VIDEO_TYPES as readonly string[]).includes(contentType)
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Use a JPG, PNG or WebP photo, or an MP4, MOV or WebM video' }, { status: 400 })
  }
  if (isImage && size > GUIDE_MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: 'Photos must be under 10 MB' }, { status: 400 })
  }
  if (isVideo && size > GUIDE_MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: 'Videos must be under 40 MB' }, { status: 400 })
  }

  const extension = fileName.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || (isVideo ? 'mp4' : 'jpg')
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.storage.from(GUIDE_BUCKET).createSignedUploadUrl(path)
    if (error || !data) throw new Error(error?.message ?? 'No upload token')
    const { data: publicData } = supabase.storage.from(GUIDE_BUCKET).getPublicUrl(path)
    return NextResponse.json({ path, token: data.token, publicUrl: publicData.publicUrl, kind: isVideo ? 'video' : 'photo' })
  } catch (err) {
    console.error('Could not prepare guide media upload', err)
    return NextResponse.json({ error: 'Could not prepare the upload' }, { status: 500 })
  }
})
