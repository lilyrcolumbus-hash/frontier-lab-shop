import { timingSafeEqual } from 'crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_LOGIN_EMAIL } from '@/lib/admin-login'
import { IS_DEMO } from '@/lib/site-mode'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Bookmark sign-in for the store owner: opening /api/admin/quick-login?key=<secret> signs in as
// ADMIN_LOGIN_EMAIL with no email or password step. The secret lives only in the server env
// (ADMIN_QUICK_LOGIN_KEY), never in the repo. It fails closed: no key set, or a key shorter than
// 32 characters, and the route refuses everything. /admin still checks StoreMember as always.
const MIN_KEY_LENGTH = 32

function keysMatch(provided: string, expected: string) {
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

function fail(origin: string) {
  const response = NextResponse.redirect(new URL('/account?next=/admin', origin))
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const expected = process.env.ADMIN_QUICK_LOGIN_KEY ?? ''
  const provided = searchParams.get('key') ?? ''

  // The demo has its own one-click button; this route is for the real store only.
  if (IS_DEMO || expected.length < MIN_KEY_LENGTH || !keysMatch(provided, expected)) {
    return fail(origin)
  }

  try {
    const { data, error: linkError } = await createAdminClient().auth.admin.generateLink({
      type: 'magiclink',
      email: ADMIN_LOGIN_EMAIL,
    })
    const tokenHash = data?.properties?.hashed_token
    if (linkError || !tokenHash) {
      console.error('quick-login: could not generate link', linkError?.message)
      return fail(origin)
    }

    const supabase = await createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash: tokenHash })
    if (verifyError) {
      console.error('quick-login: could not verify link', verifyError.message)
      return fail(origin)
    }
  } catch (error) {
    console.error('quick-login: unexpected failure', error instanceof Error ? error.message : error)
    return fail(origin)
  }

  const response = NextResponse.redirect(new URL('/admin', origin))
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
