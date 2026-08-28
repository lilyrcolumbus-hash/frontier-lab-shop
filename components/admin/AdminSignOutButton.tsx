'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminSignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/account')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-cream-muted hover:text-cream transition-colors"
    >
      Sign out
    </button>
  )
}
