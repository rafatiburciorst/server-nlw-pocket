import 'dotenv/config'
import { z } from 'zod'

const envShecma = z.object({
    DATABASE_URL: z.string()
})

const isValid = envShecma.safeParse(process.env)

if (!isValid.success) {
    console.error(isValid.error.flatten())
    throw new Error("Environment variables not found")
}

export const env = isValid.data
