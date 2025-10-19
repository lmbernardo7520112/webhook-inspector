// packages/api/src/routes/delete-webhook.ts
import { type FastifyInstance, type FastifyRequest } from 'fastify' // Importe FastifyRequest
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../db/index.js'
import { webhooks } from '../db/schema.js'
import { eq } from 'drizzle-orm'

// 1. Extraímos o schema para uma constante
const deleteWebhookParamsSchema = z.object({
  webhookId: z.string(),
})

// 2. Inferimos o tipo TypeScript a partir do schema
type DeleteWebhookParams = z.infer<typeof deleteWebhookParamsSchema>

export async function deleteWebhook(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:webhookId',
    {
      schema: {
        params: deleteWebhookParamsSchema, // Usamos a constante aqui
        response: {
          204: z.null(),
        },
      },
    },
    // 3. Aplicamos o tipo explicitamente ao handler
    async (request: FastifyRequest<{ Params: DeleteWebhookParams }>, reply) => {
      // Agora o TypeScript sabe, com 100% de certeza, que request.params tem a propriedade webhookId
      const { webhookId } = request.params

      await db.delete(webhooks).where(eq(webhooks.id, webhookId))

      return reply.status(204).send()
    }
  )
}