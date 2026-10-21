import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Reuse a single client across hot reloads in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.POSTGRES_PRISMA_URL }),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
