// packages/api/src/db/index.ts
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.js'

const connection = postgres(process.env.DATABASE_URL!)

// Criamos uma única instância 'db' e a exportamos.
// Isso nos permite importá-la em qualquer lugar da nossa API para interagir com o banco.
export const db = drizzle(connection, { schema })