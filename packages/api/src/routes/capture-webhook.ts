// packages/api/src/routes/capture-webhook.ts
import { type FastifyInstance } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createWebhook } from '../services/webhook-service.js' // <-- Importa a lógica de negócio do serviço

export async function captureWebhook(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      // O schema permanece idêntico. A "forma" externa da nossa API não mudou.
      schema: {
        body: z.any(),
        response: {
          201: z.object({
            webhookId: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        // 1. A rota continua responsável por extrair os dados da requisição HTTP.
        const { method, headers, query, body } = request

        // 2. A rota agora DELEGA a tarefa de interagir com o banco de dados
        //    para a camada de serviço.
        const newWebhook = await createWebhook({
          method,
          headers,
          queryParams: query,
          body,
        })

        // 3. A lógica de verificação e resposta permanece na rota,
        //    pois é uma responsabilidade da camada de apresentação (HTTP).
        if (!newWebhook) {
          return reply.status(500).send({ message: 'Internal Server Error: Could not create webhook entry.' })
        }
        
        return reply.status(201).send({ webhookId: newWebhook.id })

      } catch (error) {
        // Adicionamos um bloco try...catch como uma camada extra de segurança.
        // Se o serviço (ou qualquer outra coisa) lançar uma exceção inesperada,
        // nós a capturamos e retornamos um erro 500 genérico.
        console.error('Falha ao capturar webhook:', error)
        return reply.status(500).send({ message: 'An unexpected error occurred.' })
      }
    }
  )
}