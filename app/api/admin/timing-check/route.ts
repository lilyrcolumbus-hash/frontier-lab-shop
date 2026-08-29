import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// TEMPORARY diagnostic: times each step of the admin auth path to locate a ~49s stall
// seen on every /api/admin/* request. Returns durations only — no user data. Delete once fixed.
export async function GET() {
  const timings: Record<string, number> = {}
  const step = async <T>(name: string, fn: () => Promise<T>): Promise<T | null> => {
    const start = Date.now()
    try {
      return await fn()
    } catch {
      return null
    } finally {
      timings[name] = Date.now() - start
    }
  }

  const supabase = await step('createClient', async () => createClient())
  const user = await step('getUser', async () => (supabase ? (await supabase.auth.getUser()).data.user : null))
  await step('prismaCount', () => prisma.product.count())
  await step('prismaStoreMember', () =>
    user ? prisma.storeMember.findFirst({ where: { userId: user.id }, include: { store: true } }) : Promise.resolve(null)
  )

  return NextResponse.json({ timings, hasUser: Boolean(user) })
}
