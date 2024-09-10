import { client, db } from "./index.js"
import { goalCompleteions, goals } from "./schema.js"
import dayjs from "dayjs"

async function seed() {
    await db.delete(goalCompleteions)
    await db.delete(goals)
    const result = await db.insert(goals).values([
        { title: 'Acordar cedo', desiredWeekendlyFrequency: 5 },
        { title: 'Exercitar-me', desiredWeekendlyFrequency: 3 },
        { title: 'Meditar', desiredWeekendlyFrequency: 1 },
    ]).returning()

    const startOfWeek = dayjs().startOf('week')

    await db.insert(goalCompleteions).values([
        { goalId: result[0].id, createdAt: startOfWeek.toDate() },
        { goalId: result[0].id, createdAt: startOfWeek.add(1, 'day').toDate() },

    ])
}

seed().finally(() => {
    client.end()
})