import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// RFC 7591 Dynamic Client Registration. Open on purpose, like any DCR endpoint: registering a
// client grants zero access by itself — only /mcp/authorize (gated behind a real Supabase login
// that is already a StoreMember) can ever mint a code.
const registerSchema = z.object({
  redirect_uris: z.array(z.string().url()).min(1),
  client_name: z.string().trim().max(200).optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_client_metadata' }, { status: 400 })
  }

  const client = await prisma.mcpClient.create({
    data: { redirectUris: parsed.data.redirect_uris, name: parsed.data.client_name ?? '' },
  })

  return NextResponse.json({
    client_id: client.id,
    redirect_uris: client.redirectUris,
    token_endpoint_auth_method: 'none',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
  })
}
