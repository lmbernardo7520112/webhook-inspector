// packages/api/src/routes/list-webhooks.ts
import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { db } from '../db/index.js'

export async function listWebhooks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/', async (request, reply) => {
    const webhooks = await db.query.webhooks.findMany({
      orderBy: (webhooks, { desc }) => [desc(webhooks.createdAt)],
    })

    return reply.send(webhooks)
  })
}