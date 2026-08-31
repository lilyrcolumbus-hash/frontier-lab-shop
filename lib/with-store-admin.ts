import { NextRequest, NextResponse } from 'next/server'
import { requireStoreAdmin, type StoreAdmin } from '@/lib/require-store-admin'

// Shared route-handler wrapper — replaces the requireAdmin() helper that used to be
// copy-pasted into every app/api/admin/**/route.ts file. Route context (e.g. { params }) is
// passed through untouched so this works for both collection and [id] routes.
export function withStoreAdmin<Ctx = undefined>(
  handler: (req: NextRequest, admin: StoreAdmin, ctx: Ctx) => Promise<NextResponse>,
  // Owner-only routes are the ones that move money, change store-wide settings, or grant
  // access. Staff run the catalog and the orders; they cannot refund, discount, or add people.
  options: { requireOwner?: boolean } = {}
) {
  return async (req: NextRequest, ctx: Ctx) => {
    const admin = await requireStoreAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }
    if (options.requireOwner && admin.role !== 'owner') {
      return NextResponse.json({ error: 'Only the store owner can do that.' }, { status: 403 })
    }
    return handler(req, admin, ctx)
  }
}
