import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from 'src/functions/get-week-pending-goals.js';

export const getPendingGoalRoute: FastifyPluginAsyncZod = async (app) => {
    app.get('/pending-goals', async () => {
        const { pedingGoals } = await getWeekPendingGoals()
        return { pedingGoals }
    })
};