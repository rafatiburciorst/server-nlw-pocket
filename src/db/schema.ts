import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const goals = pgTable('goals', {
    id: text('id').primaryKey().$default(() => createId()),
    title: text('title').notNull(),
    desiredWeekendlyFrequency: integer('desired_weekenly_frequency').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})

export const goalCompleteions = pgTable('goal_completeions', {
    id: text('id').primaryKey().$default(() => createId()),
    goalId: text('goal_id').references(() => goals.id).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
})