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
  // /admin is an internal tool, not locale-prefixed customer content — skip next-intl's
  // locale routing for it, but still refresh the Supabase session below.
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const response = isAdminRoute ? NextResponse.next() : intlMiddleware(request)

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
  matcher: ['/((?!api|auth|_next|_vercel|.*\\..*).*)'],
}
