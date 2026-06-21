import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export default function AccountPage() {
  const t = useTranslations('account')

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-surface border-b border-ds-border py-16 text-center">
        <h1 className="font-heading text-5xl font-bold text-cream mb-3">{t('signIn')}</h1>
        <p className="text-cream-muted">Sign in to save your grow journal and orders.</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-elevated rounded-2xl border border-ds-border p-8 space-y-5">
          <div className="space-y-4">
            <Input label={t('email')} type="email" placeholder="you@example.com" />
            <Input label={t('password')} type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-cream-muted">
              <input type="checkbox" className="rounded border-ds-border" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-accent hover:text-accent-hover transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>

          <Button fullWidth size="lg">{t('signIn')}</Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ds-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-elevated px-3 text-cream-muted">or</span>
            </div>
          </div>

          <Button fullWidth variant="outline" size="lg">
            Continue with Google
          </Button>

          <p className="text-center text-sm text-cream-muted">
            Don't have an account?{' '}
            <Link href="/signup" className="text-accent hover:text-accent-hover transition-colors font-medium">
              {t('signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
