import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoal } from 'src/functions/create-goal.js';

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
    app.post('/goals', {
        schema: {
            body: z.object({
                title: z.string(),
                desiredWeekendlyFrequency: z.coerce.number()
            })
        }
    }, async request => {
        const { title, desiredWeekendlyFrequency } = request.body
        await createGoal({
            title,
            desiredWeekendlyFrequency
        })
    })
};