import 'dotenv/config'
import { defineConfig } from 'prisma/config'

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
