import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastify } from 'fastify'
import { createGoalRoute } from './routes/create-goals.js'
import { createCompletionRoute } from './routes/create-completion.js'
import { getPendingGoalRoute } from './routes/get-pending-goal.js'
import { getWeekSummaryRoute } from './routes/get-week-summary.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingGoalRoute)
app.register(getWeekSummaryRoute)


app.listen({
    port: 3333
}).then(() => console.log('http server is running'))