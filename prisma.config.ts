import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'

// Match Next.js: .env.local takes precedence over .env
config({ path: ['.env.local', '.env'], quiet: true })

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    // CLI commands (migrate, studio, etc.) use the direct, non-pooled connection
    url: process.env.POSTGRES_URL_NON_POOLING,
  },
})
