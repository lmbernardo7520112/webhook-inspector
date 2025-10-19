// packages/api/src/db/schema.ts
import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Esta tabela é projetada para capturar TUDO sobre um webhook recebido.
export const webhooks = pgTable('webhooks', {
  // Usamos CUID2 para IDs únicos, seguros e eficientes. Melhor que UUID para a maioria dos casos.
  id: text('id').primaryKey().$defaultFn(() => createId()),

  // Headers, Query Params e Body são imprevisíveis. JSONB é o tipo perfeito para isso.
  // É indexável e mais eficiente que JSON regular no Postgres.
  headers: jsonb('headers').notNull(),
  queryParams: jsonb('query_params').notNull(),
  body: jsonb('body').notNull(),

  // Metadados essenciais para a nossa UI.
  method: text('method').notNull(),
  
  // Timestamp para sabermos exatamente quando a captura ocorreu.
  // `defaultNow()` garante que o banco de dados insira a hora atual automaticamente.
  createdAt: timestamp('created_at').notNull().defaultNow(),
})