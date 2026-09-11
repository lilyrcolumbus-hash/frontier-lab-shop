import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site-url'

// RFC 8414 metadata for the minimal OAuth 2.1 authorization server backing the MCP connector —
// claude.ai discovers /mcp/authorize, /api/mcp/token and /api/mcp/register from here.
export async function GET() {
  return NextResponse.json({
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/mcp/authorize`,
    token_endpoint: `${SITE_URL}/api/mcp/token`,
    registration_endpoint: `${SITE_URL}/api/mcp/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['none'],
    scopes_supported: ['admin'],
  })
}
