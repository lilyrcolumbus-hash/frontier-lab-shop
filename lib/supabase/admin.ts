import { createClient } from '@supabase/supabase-js'

// Service-role client for server-only Admin API calls (auth.admin.*). Never import this from
// anything that could run in the browser — the key bypasses RLS entirely.
export function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
