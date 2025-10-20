// packages/api/src/services/webhook-service.ts
import { db } from '../db/index.js'
import { webhooks } from '../db/schema.js'
import { eq } from 'drizzle-orm'

export async function createWebhook(data: {
  method: string
  headers: unknown
  queryParams: unknown
  body: unknown
}) {
  const [newWebhook] = await db.insert(webhooks).values(data).returning({ id: webhooks.id })
  return newWebhook
}

export async function listWebhooks() {
  return db.query.webhooks.findMany({
    orderBy: (webhooks, { desc }) => [desc(webhooks.createdAt)],
  })
}

export async function deleteWebhook(id: string) {
  await db.delete(webhooks).where(eq(webhooks.id, id))
}