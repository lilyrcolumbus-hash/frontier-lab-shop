import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

export const AUTH_CODE_TTL_MS = 60 * 1000
export const ACCESS_TOKEN_TTL_MS = 60 * 60 * 1000
export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

export function randomToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/** RFC 7636 S256: BASE64URL(SHA256(code_verifier)) must equal the code_challenge from /authorize. */
export function verifyPkce(codeVerifier: string, codeChallenge: string): boolean {
  const computed = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  return computed === codeChallenge
}

export interface McpAdminContext {
  userId: string
  userEmail: string | null
  storeId: string
  storeName: string
  role: 'owner' | 'staff'
}

/**
 * Resolves a bearer token to the store admin it belongs to.
 *
 * Two lookups, same cost as a normal cookie-based admin request (requireStoreAdmin already does
 * a Supabase call plus a Prisma one on every /api/admin/* request) — this is the bearer-token
 * equivalent, not a new performance pattern.
 */
export async function resolveBearerToken(token: string): Promise<McpAdminContext | null> {
  const record = await prisma.mcpToken.findUnique({ where: { accessTokenHash: hashToken(token) } })
  if (!record || record.accessExpiresAt < new Date()) return null

  const member = await prisma.storeMember.findUnique({
    where: { id: record.storeMemberId },
    include: { store: true },
  })
  if (!member) return null

  const supabase = createAdminClient()
  const { data } = await supabase.auth.admin.getUserById(member.userId)

  return {
    userId: member.userId,
    userEmail: data.user?.email ?? null,
    storeId: member.store.id,
    storeName: member.store.name,
    role: member.role as 'owner' | 'staff',
  }
}
