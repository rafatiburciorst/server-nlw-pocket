import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './.migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: 'postgresql://postgres:postgres@localhost:5432/inorbit',
    }
})