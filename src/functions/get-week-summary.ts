import dayjs from "dayjs"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "src/db/index.js"
import { goalCompleteions, goals } from "src/db/schema.js"


export async function getWeekSummary() {
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

    const goalsCompletedInWeek = db.$with('goal_completed_in_week').as(
        db
            .select({
                id: goalCompleteions.id,
                title: goals.title,
                completedAt: goalCompleteions.createdAt,
                completedAtDate: sql/*sql*/`
                    DATE(${goalCompleteions.createdAt})
                `.as('completedAtDate')
            })
            .from(goalCompleteions)
            .innerJoin(goals, eq(goals.id, goalCompleteions.goalId))
            .where(and(
                gte(goalCompleteions.createdAt, fistDayOfWeek),
                lte(goalCompleteions.createdAt, lastDayOfWeek),
            ))
    )

    const goalCompletedByWeekDay = db.$with('goal_completed_by_week_day').as(
        db
            .select({
                completedDate: goalsCompletedInWeek.completedAtDate,
                completions: sql/*sql*/`
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', ${goalsCompletedInWeek.id},
                            'title', ${goalsCompletedInWeek.title},
                            'completedAt', ${goalsCompletedInWeek.completedAt}
                        )
                    )
                `.as('completions')
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)
    )


    const result = await db.with(
        goalsCreatedUpToWeek,
        goalsCompletedInWeek,
        goalCompletedByWeekDay
    )
        .select()
        .from(goalCompletedByWeekDay)

    return {
        summary: result
    }
}
