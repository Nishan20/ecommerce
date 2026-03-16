import { defineConfig } from '@prisma/internals'

export default defineConfig({
  connectionString: process.env.DATABASE_URL
})

