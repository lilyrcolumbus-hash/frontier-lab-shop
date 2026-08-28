import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import type { Store } from '@prisma/client'
import type { User } from '@supabase/supabase-js'

export type StoreAdmin = {
  user: User
  store: Store
  role: 'owner' | 'staff'
}

// Resolves the signed-in Supabase user to the Store they administer, via StoreMember.
// Replaces the old flat ADMIN_EMAILS allowlist (lib/is-admin.ts) — one login = one store.
export async function requireStoreAdmin(): Promise<StoreAdmin | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const member = await prisma.storeMember.findFirst({
    where: { userId: user.id },
    include: { store: true },
  })
  if (!member) return null

  return { user, store: member.store, role: member.role as 'owner' | 'staff' }
}
