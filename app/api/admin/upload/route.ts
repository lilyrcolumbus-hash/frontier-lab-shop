import { NextResponse } from 'next/server'
import { withStoreAdmin } from '@/lib/with-store-admin'
import { uploadImage } from '@/lib/cloudinary'

const MAX_BYTES = 8 * 1024 * 1024

export const POST = withStoreAdmin(async (req) => {
  const form = await req.formData().catch(() => null)
  const file = form?.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image must be under 8MB' }, { status: 400 })
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    const url = await uploadImage(base64, 'frontier-lab')
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Cloudinary upload failed', err)
    return NextResponse.json({ error: 'Upload failed — check Cloudinary credentials' }, { status: 500 })
  }
})
