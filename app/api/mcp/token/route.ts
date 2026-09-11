import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  randomToken,
  hashToken,
  verifyPkce,
  ACCESS_TOKEN_TTL_MS,
  REFRESH_TOKEN_TTL_MS,
} from '@/lib/mcp/tokens'

const tokenSchema = z.discriminatedUnion('grant_type', [
  z.object({
    grant_type: z.literal('authorization_code'),
    code: z.string().min(1),
    redirect_uri: z.string().url(),
    client_id: z.string().min(1),
    code_verifier: z.string().min(1),
  }),
  z.object({
    grant_type: z.literal('refresh_token'),
    refresh_token: z.string().min(1),
  }),
])

async function issueTokenPair(clientId: string, storeMemberId: string) {
  const accessToken = randomToken()
  const refreshToken = randomToken()
  await prisma.mcpToken.create({
    data: {
      accessTokenHash: hashToken(accessToken),
      refreshTokenHash: hashToken(refreshToken),
      clientId,
      storeMemberId,
      accessExpiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL_MS),
      refreshExpiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  })
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: Math.floor(ACCESS_TOKEN_TTL_MS / 1000),
    refresh_token: refreshToken,
  }
}

export async function POST(req: Request) {
  // The OAuth spec allows both bodies; claude.ai's token client sends one or the other.
  const contentType = req.headers.get('content-type') ?? ''
  const raw = contentType.includes('application/json')
    ? await req.json().catch(() => null)
    : Object.fromEntries((await req.formData().catch(() => new FormData())).entries())

  const parsed = tokenSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  }

  if (parsed.data.grant_type === 'authorization_code') {
    const { code, redirect_uri, client_id, code_verifier } = parsed.data
    const authCode = await prisma.mcpAuthCode.findUnique({ where: { code } })
    // Single use — delete it whether or not the rest checks out, so a leaked or replayed code
    // can never be redeemed twice.
    if (authCode) await prisma.mcpAuthCode.delete({ where: { code } }).catch(() => {})

    if (
      !authCode ||
      authCode.expiresAt < new Date() ||
      authCode.clientId !== client_id ||
      authCode.redirectUri !== redirect_uri ||
      !verifyPkce(code_verifier, authCode.codeChallenge)
    ) {
      return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })
    }

    return NextResponse.json(await issueTokenPair(authCode.clientId, authCode.storeMemberId))
  }

  // refresh_token grant — rotate: the old pair is retired the moment a new one is issued.
  const existing = await prisma.mcpToken.findUnique({
    where: { refreshTokenHash: hashToken(parsed.data.refresh_token) },
  })
  if (!existing || existing.refreshExpiresAt < new Date()) {
    return NextResponse.json({ error: 'invalid_grant' }, { status: 400 })
  }

  await prisma.mcpToken.delete({ where: { id: existing.id } }).catch(() => {})
  return NextResponse.json(await issueTokenPair(existing.clientId, existing.storeMemberId))
}
