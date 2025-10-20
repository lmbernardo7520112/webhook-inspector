// packages/api/src/routes/list-webhooks.ts
import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { listWebhooks as listWebhooksService } from '../services/webhook-service.js' // Importa o serviço
import { z } from 'zod'

export async function listWebhooks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      // Adicionamos um schema de resposta para consistência e auto-documentação.
      schema: {
        response: {
          200: z.array(z.any()), // Esperamos um array de qualquer objeto
          500: z.object({ message: z.string() })
        }
      }
    },
    async (request, reply) => {
      try {
        // A rota chama o serviço para obter os dados.
        const webhooks = await listWebhooksService()

        // A rota envia os dados obtidos.
        return reply.send(webhooks)
      } catch (error) {
        console.error('Falha ao listar webhooks:', error)
        return reply.status(500).send({ message: 'An unexpected error occurred.' })
      }
    }
  )
}