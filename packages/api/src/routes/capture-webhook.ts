// packages/api/src/routes/capture-webhook.ts
import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.js'
import { webhooks } from '../db/schema.js'

export async function captureWebhook(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.any(),
        // --- A MUDANÇA CRÍTICA ESTÁ AQUI ---
        // Expandimos o contrato de resposta para incluir um possível erro 500.
        response: {
          201: z.object({
            webhookId: z.string(),
          }),
          // Agora, o TypeScript sabe que um erro 500 com esta forma é permitido.
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method
      const headers = request.headers
      const queryParams = request.query
      const body = request.body

      const result = await db
        .insert(webhooks)
        .values({
          method,
          headers,
          queryParams,
          body,
        })
        .returning({
          id: webhooks.id,
        })

      const newWebhook = result[0]

      if (!newWebhook) {
        // Esta linha agora é VÁLIDA porque o schema permite uma resposta 500.
        // O TypeScript também verificará se o corpo ({ message: ... }) corresponde ao schema 500.
        return reply.status(500).send({ message: 'Internal Server Error: Could not create webhook entry.' })
      }
      
      // Esta linha continua válida porque o schema permite uma resposta 201.
      return reply.status(201).send({ webhookId: newWebhook.id })
    }
  )
}