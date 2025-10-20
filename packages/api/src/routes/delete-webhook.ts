// packages/api/src/routes/delete-webhook.ts
import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { deleteWebhook as deleteWebhookService } from '../services/webhook-service.js' // Importa o serviço

const deleteWebhookParamsSchema = z.object({
  webhookId: z.string(),
})

type DeleteWebhookParams = z.infer<typeof deleteWebhookParamsSchema>

export async function deleteWebhook(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:webhookId',
    {
      // O schema de contrato da API permanece o mesmo.
      schema: {
        params: deleteWebhookParamsSchema,
        response: {
          204: z.null(),
          500: z.object({ message: z.string() })
        },
      },
    },
    async (request: FastifyRequest<{ Params: DeleteWebhookParams }>, reply) => {
      try {
        // A rota extrai o ID da requisição.
        const { webhookId } = request.params

        // A rota delega a ação de exclusão ao serviço.
        await deleteWebhookService(webhookId)

        // A rota envia a resposta de sucesso.
        return reply.status(204).send()
      } catch (error) {
        console.error(`Falha ao excluir webhook ${request.params.webhookId}:`, error)
        return reply.status(500).send({ message: 'An unexpected error occurred.' })
      }
    }
  )
}