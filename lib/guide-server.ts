import { prisma } from '@/lib/prisma'

/** True when another product already uses this guide address, which would make /g/<slug> ambiguous. */
export async function guideSlugTaken(slug: string, exceptProductId?: string): Promise<boolean> {
  const other = await prisma.product.findFirst({
    where: {
      guide: { path: ['slug'], equals: slug },
      ...(exceptProductId ? { id: { not: exceptProductId } } : {}),
    },
    select: { id: true },
  })
  return Boolean(other)
}
