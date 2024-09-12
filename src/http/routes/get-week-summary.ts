import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from 'src/functions/get-week-pending-goals.js';
import { getWeekSummary } from 'src/functions/get-week-summary.js';

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
    app.get('/summary', async () => {
        const { summary } = await getWeekSummary()
        return { summary }
    })
};