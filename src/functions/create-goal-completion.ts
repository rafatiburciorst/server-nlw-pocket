import dayjs from "dayjs"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "src/db/index.js"
import { goalCompleteions, goals } from "src/db/schema.js"

interface CreateGoalCompletionrequest {
    goalId: string
}

export async function createGoalCompletion({ goalId }: CreateGoalCompletionrequest) {

    const fistDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCompletionCount = db.$with('goal_completion_counts').as(
        db
            .select({
                goalId: goalCompleteions.goalId,
                completionCount: count(goalCompleteions.id)
                    .as('completionCount'),
            })
            .from(goalCompleteions)
            .where(and(
                gte(goalCompleteions.createdAt, fistDayOfWeek),
                lte(goalCompleteions.createdAt, lastDayOfWeek),
                eq(goalCompleteions.goalId, goalId)
            ))
            .groupBy(goalCompleteions.goalId)
    )

    const result = await db
        .with(goalsCompletionCount)
        .select({
            disiredWeeklyFrequency: goals.desiredWeekendlyFrequency,
            completionCount: sql/*sql*/`
                COALESCE(${goalsCompletionCount.completionCount}, 0)
            `.mapWith(Number)
        })
        .from(goals)
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
        .where(eq(goals.id, goalId))
        .limit(1)

    const { completionCount, disiredWeeklyFrequency } = result[0]

    if (completionCount >= disiredWeeklyFrequency) {
        throw new Error('Goal already completed this week!')
    }

    const [goalCompleteion] = await db.insert(goalCompleteions).values({
        goalId
    }).returning()

    return {
        goalCompleteion
    }
}