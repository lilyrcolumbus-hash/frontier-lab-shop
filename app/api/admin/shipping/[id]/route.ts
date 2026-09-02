import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withStoreAdmin } from '@/lib/with-store-admin'

/** Deletes a zone (and its rates, by cascade) or a single rate — whichever the id names. */
export const DELETE = withStoreAdmin<{ params: { id: string } }>(
  async (req, { store }, { params }) => {
    const kind = new URL(req.url).searchParams.get('kind')

    if (kind === 'rate') {
      const rate = await prisma.shippingRate.findFirst({ where: { id: params.id, storeId: store.id } })
      if (!rate) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      await prisma.shippingRate.delete({ where: { id: params.id } })
      return NextResponse.json({ ok: true })
    }

    const zone = await prisma.shippingZone.findFirst({ where: { id: params.id, storeId: store.id } })
    if (!zone) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.shippingZone.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  },
  { requireOwner: true }
)
