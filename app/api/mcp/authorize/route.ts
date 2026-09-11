import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireStoreAdmin } from '@/lib/require-store-admin'
import { randomToken, AUTH_CODE_TTL_MS } from '@/lib/mcp/tokens'

// Mints a one-time auth code once the /mcp/authorize page has confirmed a real, logged-in store
// admin clicked "Allow". This is a plain POST rather than the OAuth-standard redirect-based GET,
// because the human-facing login + consent screen lives entirely in that page — this endpoint is
// just the part of it that needs a cookie-authenticated session to run.
const bodySchema = z.object({
  client_id: z.string().min(1),
  redirect_uri: z.string().url(),
  code_challenge: z.string().min(1),
  code_challenge_method: z.literal('S256').default('S256'),
})

export async function POST(req: Request) {
  const admin = await requireStoreAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const client = await prisma.mcpClient.findUnique({ where: { id: parsed.data.client_id } })
  if (!client || !client.redirectUris.includes(parsed.data.redirect_uri)) {
    return NextResponse.json({ error: 'Unknown client or redirect URI.' }, { status: 400 })
  }

  const member = await prisma.storeMember.findFirst({
    where: { userId: admin.user.id, storeId: admin.store.id },
  })
  if (!member) {
    return NextResponse.json({ error: 'Not authorized for this store.' }, { status: 403 })
  }

  const code = randomToken()
  await prisma.mcpAuthCode.create({
    data: {
      code,
      clientId: client.id,
      storeMemberId: member.id,
      redirectUri: parsed.data.redirect_uri,
      codeChallenge: parsed.data.code_challenge,
      codeChallengeMethod: parsed.data.code_challenge_method,
      expiresAt: new Date(Date.now() + AUTH_CODE_TTL_MS),
    },
  })

  const redirectUrl = new URL(parsed.data.redirect_uri)
  redirectUrl.searchParams.set('code', code)

  return NextResponse.json({ redirectUrl: redirectUrl.toString() })
}
