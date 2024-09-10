import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastify } from 'fastify'
import { createGoal } from 'src/functions/create-goal.js'
import { z } from 'zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

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

app.listen({
    port: 3333
}).then(() => console.log('http server is running'))