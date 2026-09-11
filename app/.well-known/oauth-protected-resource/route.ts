import { protectedResourceHandler, metadataCorsOptionsRequestHandler } from 'mcp-handler'
import { SITE_URL } from '@/lib/site-url'

// RFC 9728 — tells an MCP client which authorization server protects /api/mcp.
const handler = protectedResourceHandler({ authServerUrls: [SITE_URL] })
const corsHandler = metadataCorsOptionsRequestHandler()

export { handler as GET, corsHandler as OPTIONS }
