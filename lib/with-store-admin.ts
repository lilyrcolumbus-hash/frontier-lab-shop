import { NextRequest, NextResponse } from 'next/server'
import { requireStoreAdmin, type StoreAdmin } from '@/lib/require-store-admin'

// What the public demo account sees instead of customer data. Exact paths get an empty list so the
// screen still renders; everything underneath them (one order, one customer, an export) is refused.
const DEMO_EMPTY_LISTS: Record<string, unknown> = {
  '/api/admin/customers': { customers: [] },
  '/api/admin/orders': { orders: [], total: 0, page: 1, pageSize: 25 },
  '/api/admin/staff': { staff: [] },
  '/api/admin/gift-cards': { giftCards: [] },
}
const DEMO_HIDDEN_PREFIXES = [
  '/api/admin/customers/',
  '/api/admin/orders/',
  '/api/admin/gift-cards/',
  '/api/admin/staff/',
  '/api/admin/analytics/',
]

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
    if (admin.isDemo) {
      // The public demo account looks at everything and changes nothing.
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        return NextResponse.json({ error: 'This is a read-only demo, so nothing is saved.' }, { status: 403 })
      }
      const path = req.nextUrl.pathname
      if (path in DEMO_EMPTY_LISTS) return NextResponse.json(DEMO_EMPTY_LISTS[path])
      if (DEMO_HIDDEN_PREFIXES.some((prefix) => path.startsWith(prefix))) {
        return NextResponse.json({ error: 'Hidden in the demo to protect customer data.' }, { status: 404 })
      }
    } else if (options.requireOwner && admin.role !== 'owner') {
      return NextResponse.json({ error: 'Only the store owner can do that.' }, { status: 403 })
    }
    const response = await handler(req, admin, ctx)
    if (admin.isDemo && req.nextUrl.pathname === '/api/admin/settings' && response.ok) {
      // The business email and street address are not for public display.
      const body = await response.clone().json()
      if (body?.settings) {
        for (const field of ['supportEmail', 'addressLine1', 'addressLine2', 'postalCode']) {
          if (body.settings[field]) body.settings[field] = '(hidden in the demo)'
        }
        return NextResponse.json(body)
      }
    }
    return response
  }
}
