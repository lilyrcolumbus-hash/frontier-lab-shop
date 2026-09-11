import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
})

export default async function middleware(request: NextRequest) {
  // /admin and the MCP connector's login/consent page are internal tools, not locale-prefixed
  // customer content — skip next-intl's locale routing for them, but still refresh the Supabase
  // session below.
  const { pathname } = request.nextUrl
  const isInternalRoute =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/mcp') ||
    pathname.startsWith('/api/mcp')
  const response = isInternalRoute ? NextResponse.next() : intlMiddleware(request)

  // Refresh the Supabase session cookie on every navigation — required by @supabase/ssr
  // so client/server components always see a valid, non-expired session.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}

export const config = {
  // The admin API, and the one MCP route that reads the Supabase session cookie
  // (/api/mcp/authorize — the code-minting step behind the login+consent page), are matched
  // explicitly on top of the page matcher. Without it those routes refresh the Supabase session
  // themselves, in a context that cannot write cookies back: the refresh token rotates at
  // Supabase but the browser keeps the spent one, so every later refresh fails and auth-js
  // retries with backoff — ~45s per call, which timed the admin out (Session 29). The rest of
  // /api/mcp/* (register, token, and the MCP endpoint itself) authenticates purely via its own
  // bearer tokens and never touches this cookie, so it is deliberately left out.
  matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)', '/api/admin/:path*', '/api/mcp/authorize/:path*'],
}
