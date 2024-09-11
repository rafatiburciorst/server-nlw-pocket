import dayjs from 'dayjs'
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from 'src/db/index.js'
import { goalCompleteions, goals } from 'src/db/schema.js'


export async function getWeekPendingGoals() {
    const fistDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
        db
            .select({
                id: goals.id,
                title: goals.title,
                desiredWeekendlyFrequency: goals.desiredWeekendlyFrequency,
                createdAt: goals.createdAt,
            })
            .from(goals)
            .where(lte(goals.createdAt, lastDayOfWeek))
    )

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
                lte(goalCompleteions.createdAt, lastDayOfWeek)
            ))
            .groupBy(goalCompleteions.goalId)
    )

    const pedingGoals = await db.with(goalsCreatedUpToWeek, goalsCompletionCount)
        .select({
            id: goalsCreatedUpToWeek.id,
            title: goalsCreatedUpToWeek.title,
            disiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeekendlyFrequency,
            completionCount: sql/*sql*/`
                COALESCE(${goalsCompletionCount.completionCount}, 0)
            `.mapWith(Number)
        })
        .from(goalsCreatedUpToWeek)
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goalsCreatedUpToWeek.id))


    return { pedingGoals }
}
