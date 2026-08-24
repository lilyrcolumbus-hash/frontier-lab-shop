import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { email: session.user.email },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ orders })
}
