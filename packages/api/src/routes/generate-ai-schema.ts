// packages/api/src/routes/generate-ai-schema.ts
import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Readable } from 'stream'

const generateAiSchemaBodySchema = z.object({
  jsonPayload: z.string(),
})

type GenerateAiSchemaBody = z.infer<typeof generateAiSchemaBodySchema>

// --- A CORREÇÃO FINAL DE TIPO E SEGURANÇA ---
// 1. Buscamos a chave de API da variável de ambiente.
const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY

// 2. Verificamos se a chave existe. Se não, a aplicação não pode funcionar.
if (!geminiApiKey) {
  throw new Error('A variável de ambiente GOOGLE_GEMINI_API_KEY não está definida.')
}

// 3. AGORA, o TypeScript sabe que `geminiApiKey` é uma `string`, não `undefined`.
//    A criação do cliente agora é 100% type-safe.
const google = createGoogleGenerativeAI({
  apiKey: geminiApiKey,
})

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

      try {
        const result = await streamText({
          model: google('models/gemini-2.5-pro'), 
          prompt,
        })

        const nodeStream = Readable.from(result.textStream)

        return reply.send(nodeStream)
      } catch (error) {
        console.error('Erro ao chamar a API de IA:', error)
        return reply.status(500).send({ message: 'Falha ao comunicar com a API de IA.' })
      }
    }
  )
}