import { db } from "src/db/index.js"
import { goals } from "src/db/schema.js"

interface CreateGoalrequest {
    title: string
    desiredWeekendlyFrequency: number
}

export async function createGoal({ title, desiredWeekendlyFrequency }: CreateGoalrequest) {

    const [result] = await db.insert(goals).values({
        title,
        desiredWeekendlyFrequency
    }).returning()

    return {
        goal: result
    }
}