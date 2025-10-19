// packages/api/drizzle.config.ts

/// <reference types="node" />

// Esta diretiva acima é uma ordem direta para o compilador TypeScript.
// Ela diz: "Para este arquivo, carregue FORÇADAMENTE todas as definições
// de tipo do pacote '@types/node', independentemente de qualquer outra configuração."
// Isso irá resolver o erro 'Cannot find name 'process''.

import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})