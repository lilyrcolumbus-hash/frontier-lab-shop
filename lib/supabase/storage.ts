import { createAdminClient } from '@/lib/supabase/admin'

export const PRODUCT_IMAGE_BUCKET = 'product-images'

/**
 * Uploads a product image to Supabase Storage and returns its public URL.
 *
 * Storage lives in the same Supabase project as the database, so there is no extra vendor
 * account to keep alive. Delivery optimisation (resize, modern formats) is handled by
 * next/image, which is why the original file is stored as-is.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createAdminClient()
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
