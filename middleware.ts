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

/**
 * Temporary full-site outage — owner's call, 2026-09-22 (myfrontierlab.com's domain got
 * suspended by the registrar). Every customer-facing page and write endpoint answers 503
 * while it's on; /admin, /api/admin and the MCP connector are left alone so the owner can
 * keep managing the store. Set back to false (or delete this block) to reopen the site —
 * nothing else about the app changes.
 */
const MAINTENANCE_MODE = false

function maintenanceResponse(request: NextRequest): NextResponse {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'temporarily_unavailable' },
      { status: 503, headers: { 'Retry-After': '3600' } }
    )
  }
  return new NextResponse(
    `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Frontier Lab</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F6F5F1;color:#161513;font-family:system-ui,sans-serif;">
<p style="max-width:26rem;text-align:center;padding:0 1.5rem;line-height:1.5;">We're offline for maintenance right now. Please check back soon.</p>
</body></html>`,
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '3600' } }
  )
}

export default async function middleware(request: NextRequest) {
  // /admin and the MCP connector's login/consent page are internal tools, not locale-prefixed
  // customer content — skip next-intl's locale routing for them, but still refresh the Supabase
  // session below.
  const { pathname } = request.nextUrl
  // Any /api/* route is never locale-prefixed content, so it must never reach intlMiddleware —
  // that includes /api/checkout, /api/newsletter, /api/reviews and /api/account, which the
  // maintenance-mode matcher below started invoking the middleware function for (Session 47)
  // without ever being added here. While MAINTENANCE_MODE was on this was masked (those paths
  // got the maintenance response before reaching this check at all); turning it off exposed it:
  // every one of those routes was being routed through next-intl's page-locale logic instead of
  // passing straight through, and came back 404.
  const isInternalRoute = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/mcp')

  if (MAINTENANCE_MODE && !isInternalRoute) {
    return maintenanceResponse(request)
  }

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
  matcher: [
    '/((?!api|auth|_next|_vercel|.*\\..*).*)',
    '/api/admin/:path*',
    '/api/mcp/authorize/:path*',
    // Customer-facing write endpoints — added for the maintenance outage above so a visitor
    // can't buy or write anything while the pages are down, even by calling the API directly.
    // /api/stripe/webhook is deliberately left out: harmless to keep answering Stripe with no
    // storefront reachable, and safer than risking a missed event.
    '/api/checkout/:path*',
    '/api/newsletter/:path*',
    '/api/reviews/:path*',
    '/api/account/:path*',
  ],
}
