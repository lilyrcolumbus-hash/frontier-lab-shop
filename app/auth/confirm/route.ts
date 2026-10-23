import { type EmailOtpType } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// `next` comes from the Supabase email template's `{{ .RedirectTo }}` variable, which mirrors
// whatever `emailRedirectTo`/`redirectTo` the app passed at signUp/resetPasswordForEmail time —
// always a full absolute URL (Supabase requires those to be allow-listed), never a relative path.
function appendParam(url: string, param: string, origin: string) {
  // `url` is normally absolute, but tolerate a relative path so a hand-built or
  // mis-configured link redirects instead of throwing a 500 out of `new URL()`.
  const target = new URL(url, origin)
  const [key, value] = param.split('=')
  target.searchParams.set(key, value)
  return target.toString()
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? `${origin}/`
  const code = searchParams.get('code')

  // Magic link (passwordless admin sign-in): Supabase's PKCE flow comes back with `?code=`.
  // Only same-origin destinations are followed, so a crafted link can't bounce elsewhere.
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    const destination = new URL(next, origin)
    if (!error && destination.origin === origin) {
      return NextResponse.redirect(destination.toString())
    }
    return NextResponse.redirect(appendParam(`${origin}/account?next=/admin`, 'verify=expired', origin))
  }

  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if (!error) {
      if (type === 'magiclink' || type === 'email') {
        return NextResponse.redirect(new URL(next, origin).toString())
      }
      const successParam = type === 'signup' ? 'verify=success' : 'reset=ready'
      return NextResponse.redirect(appendParam(next, successParam, origin))
    }
  }

  return NextResponse.redirect(appendParam(next, 'verify=expired', origin))
}
