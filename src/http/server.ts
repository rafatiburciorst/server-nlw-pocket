import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastify } from 'fastify'
import { createGoal } from 'src/functions/create-goal.js'
import { z } from 'zod'
import { getWeekPendingGoals } from 'src/functions/get-week-pending-goals.js'
import { createGoalCompletion } from 'src/functions/create-goal-completion.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/pending-goals', async () => {
    const { pedingGoals } = await getWeekPendingGoals()
    return { pedingGoals }
})

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

app.post('/completions', {
    schema: {
        body: z.object({
            goalId: z.string()
        })
    }
}, async request => {
    const { goalId } = request.body
    await createGoalCompletion({
        goalId
    })
})

app.listen({
    port: 3333
}).then(() => console.log('http server is running'))