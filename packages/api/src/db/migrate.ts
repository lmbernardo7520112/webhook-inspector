// packages/api/src/db/migrate.ts
import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connection = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(connection)

async function main() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: 'drizzle' })
  console.log('Migrations finished!')
  await connection.end()
}

main()