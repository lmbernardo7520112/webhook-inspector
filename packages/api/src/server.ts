// packages/api/src/server.ts

import 'dotenv/config'
import fastifyCors from '@fastify/cors' // <-- IMPORTE
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { z } from 'zod' // <-- A CORREÇÃO CRÍTICA ESTÁ AQUI. Zod é necessário para o envSchema.
import { captureWebhook } from './routes/capture-webhook.js'
import { listWebhooks } from './routes/list-webhooks.js' // <-- IMPORTE
import { deleteWebhook } from './routes/delete-webhook.js' // <-- IMPORTE
import { generateAiSchema } from './routes/generate-ai-schema.js' // <-- IMPORTE


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Registre o plugin de CORS
app.register(fastifyCors, {
  origin: '*', // Para desenvolvimento, permitimos qualquer origem. Em produção, isso seria restrito.
})

// Registra nosso plugin de rota com o prefixo correto.
app.register(captureWebhook, { prefix: '/webhooks' })
app.register(listWebhooks, { prefix: '/webhooks' }) // <-- REGISTRE
app.register(deleteWebhook, { prefix: '/webhooks' }) // <-- REGISTRE
app.register(generateAiSchema, { prefix: '/ai' }) // <-- REGISTRE COM NOVO PREFIXO


// Esta seção precisa do Zod, por isso a importação é necessária.
const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
})
const env = envSchema.parse(process.env)

app.listen({
  port: env.PORT,
}).then(() => {
  console.log(`🚀 HTTP server running on http://localhost:${env.PORT}`)
})