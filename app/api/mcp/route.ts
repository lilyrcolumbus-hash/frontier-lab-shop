import type { AuthInfo } from '@modelcontextprotocol/server'
import { createMcpHandler, withMcpAuth } from 'mcp-handler'
import { resolveBearerToken } from '@/lib/mcp/tokens'
import { registerTools } from '@/lib/mcp/tools'

const handler = createMcpHandler(
  (server) => {
    registerTools(server)
  },
  { serverInfo: { name: 'frontier-lab-admin', version: '1.0.0' } }
)

const verifyToken = async (_req: Request, bearerToken?: string): Promise<AuthInfo | undefined> => {
  if (!bearerToken) return undefined
  const admin = await resolveBearerToken(bearerToken)
  if (!admin) return undefined

  return {
    token: bearerToken,
    scopes: ['admin'],
    clientId: admin.storeId,
    extra: { userId: admin.userId, userEmail: admin.userEmail, storeId: admin.storeId, storeName: admin.storeName, role: admin.role },
  }
}

const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
  resourceMetadataPath: '/.well-known/oauth-protected-resource',
})

export { authHandler as GET, authHandler as POST }
