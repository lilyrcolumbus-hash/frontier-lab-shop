import { NextRequest, NextResponse } from 'next/server'
import { requireStoreAdmin, type StoreAdmin } from '@/lib/require-store-admin'

// Shared route-handler wrapper — replaces the requireAdmin() helper that used to be
// copy-pasted into every app/api/admin/**/route.ts file. Route context (e.g. { params }) is
// passed through untouched so this works for both collection and [id] routes.
export function withStoreAdmin<Ctx = undefined>(
  handler: (req: NextRequest, admin: StoreAdmin, ctx: Ctx) => Promise<NextResponse>
) {
  return async (req: NextRequest, ctx: Ctx) => {
    const admin = await requireStoreAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    return handler(req, admin, ctx)
  }
}
