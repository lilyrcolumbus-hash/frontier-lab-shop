import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
p.siteContent.findMany().then((r) => { console.log(JSON.stringify(r)); return p.$disconnect() })
