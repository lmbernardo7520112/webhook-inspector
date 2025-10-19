import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

const generateAiSchemaBodySchema = z.object({
  jsonPayload: z.string(),
})

type GenerateAiSchemaBody = z.infer<typeof generateAiSchemaBodySchema>

export async function generateAiSchema(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/generate-schema',
    {
      schema: {
        body: generateAiSchemaBodySchema,
      },
    },
    async (request: FastifyRequest<{ Body: GenerateAiSchemaBody }>, reply) => {
      const { jsonPayload } = request.body
      const prompt = `
        Analyze the following JSON payload and generate a Zod schema in TypeScript that validates its structure.
        Your response must be ONLY the TypeScript code for the Zod schema, without any explanations, comments, or markdown formatting.
        The schema should be assigned to a constant named 'schema'.
        JSON Payload:
\`\`\`json
${jsonPayload}
\`\`\`
      `
      const result = await streamText({
        model: google('gemini-pro'),
        prompt,
      })
      // --- A SOLUÇÃO FINAL E PRAGMÁTICA ---
      // A função `toAIStream()` existe na biblioteca, mas o TypeScript pode não inferir corretamente devido a genéricos.
      // Usamos uma asserção de tipo para resolver o erro de compilação.
      const stream = (result as any).toAIStream()
      // Enviamos o stream diretamente para o Fastify.
      return reply.send(stream)
    }
  )
}