# 🧠 Webhook Inspector — Debugger Inteligente com IA (Google Gemini)
![Fastify](https://img.shields.io/badge/Fastify-5.x-black?style=for-the-badge&logo=fastify)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![DrizzleORM](https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-lightblue?style=for-the-badge&logo=postgresql)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-React_App-purple?style=for-the-badge&logo=vite)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-Data_Fetching-green?style=for-the-badge)
![Radix UI](https://img.shields.io/badge/Radix_UI-Accessible_Components-orange?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI_Coding_Assistant-pink?style=for-the-badge&logo=google)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=for-the-badge&logo=docker)

---

## 📘 Descrição Geral
O **Webhook Inspector** é uma ferramenta full-stack projetada para **capturar, inspecionar e analisar requisições de webhooks** em tempo real — e agora, com a **integração da IA do Google Gemini**, é capaz de **gerar automaticamente schemas Zod em TypeScript** a partir de payloads JSON.

Esta aplicação nasceu da engenharia forense e da reconstrução lógica de um projeto avançado de **debugger inteligente**, combinando **Fastify**, **PostgreSQL (Drizzle ORM)** e **React** em uma arquitetura moderna, modular e escalável.

---

## 🧩 Arquitetura Geral

```text
┌──────────────────────────────┐
│ Frontend │ → React + Vite + TanStack Query
│ (Visualizador de Webhooks)   │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Backend │ → Fastify + Drizzle ORM + Gemini AI
│ (Captura / Armazenamento / Geração de Código) │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Banco de Dados │ → PostgreSQL (Docker)
│ (Tabela: webhooks)           │
└──────────────────────────────┘
```

---

## ⚙️ Estrutura do Monorepo

```text
webhook-inspector/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── packages/
│   ├── api/  ← Backend Fastify + Drizzle + Gemini AI
│   └── web/  ← Frontend React + Vite + Radix UI + Shiki
```

- **Gerenciador de pacotes:** `pnpm`
- **Banco de dados:** PostgreSQL 16 (via Docker)
- **ORM:** Drizzle (migrações e estúdio integrados)
- **Ambiente:** `.env` e `.env.example` com isolamento seguro

---

## 🧠 Fluxo Lógico da Aplicação

### 1. Captura de Webhooks
O backend expõe um endpoint dinâmico `POST /webhooks`, capaz de receber **qualquer requisição externa** e armazenar:

- Headers (`JSONB`)
- Query Params (`JSONB`)
- Body (`JSONB`)
- Timestamp (`captured_at`)

Os webhooks são identificados por um **código único (cuid2)** e persistidos via Drizzle ORM.

---

### 2. Visualização Interativa (Frontend)
A aplicação web apresenta uma **UI de duas colunas**:

| Painel | Função |
|--------|---------|
| Esquerdo | Lista de webhooks capturados em tempo real (`refetchInterval: 2000ms`) |
| Direito | Visualização detalhada do payload, headers e status |

- **Shiki** é utilizado para syntax highlighting do JSON.
- **react-resizable-panels** permite redimensionamento dinâmico das colunas.
- **Radix Dialog** abre modais para ações futuras (ex: exclusão, geração de schema).

---

### 3. IA — Geração de Código (Google Gemini)
A funcionalidade mais poderosa: **gerar automaticamente um schema Zod em TypeScript** a partir de qualquer payload JSON recebido.

#### 🧬 Fluxo de Inteligência Artificial
1. Usuário seleciona um webhook e clica em **“Gerar Schema Zod”**.  
2. O frontend envia o payload JSON para o endpoint `/ai/generate-schema`.  
3. O backend utiliza o **Vercel AI SDK** e o modelo `gemini-pro` do Google.  
4. A resposta é enviada em **stream**, criando um efeito “digitação ao vivo” no modal.  
5. O frontend exibe o resultado com destaque de sintaxe e botão de cópia.

#### 🧩 Engenharia de Prompt
O prompt do backend é cuidadosamente projetado para retorno limpo e utilizável:

```text
Analyze the following JSON payload and generate a Zod schema in TypeScript 
that validates its structure.

Your response must be ONLY the TypeScript code for the Zod schema,
without explanations, comments, or markdown formatting.

Assign it to a constant named 'schema'.
```

---

## 📜 Backend — Estrutura de Diretórios

```text
packages/api/
├── drizzle/                     # Migrações SQL
├── drizzle.config.ts
├── src/
│   ├── db/
│   │   ├── migrate.ts           # Scripts de migração Drizzle
│   │   └── schema.ts            # Definição da tabela webhooks
│   ├── routes/
│   │   ├── capture-webhook.ts   # POST /webhooks
│   │   ├── list-webhooks.ts     # GET /webhooks
│   │   ├── delete-webhook.ts    # DELETE /webhooks/:id
│   │   └── generate-ai-schema.ts# POST /ai/generate-schema (IA)
│   └── server.ts                # Registro das rotas + boot do Fastify
└── .env                         # GOOGLE_GEMINI_API_KEY + DB_URL
```

---

## 🧠 Decisões Técnicas Centrais

| Tema | Estratégia | Benefício |
|------|-------------|------------|
| **Fastify + Zod TypeProvider** | Tipagem forte e validação automática | Segurança e clareza |
| **Drizzle ORM + PostgreSQL** | Migrations automáticas e Studio integrado | Produtividade e rastreabilidade |
| **TanStack Query (Polling)** | Atualização em tempo real | UX responsiva |
| **Streaming com AI SDK** | Resposta token a token | Interatividade de “typing live” |
| **Prompt Engineering Estruturado** | Saídas limpas e sem parsing | Integração direta no front |
| **Docker Compose** | Containerização local | Setup consistente e portátil |

---

## 🧩 Jornada de Desenvolvimento

### 🧱 Aula 1 — Backend com Fastify e PostgreSQL
- Configuração inicial com **Fastify + Zod**.  
- Integração com **Drizzle ORM** e migrações SQL automáticas.  
- Endpoint `POST /webhooks` com persistência em PostgreSQL.  

### ⚛️ Aula 2 — Frontend com React e TanStack Query
- Criação de SPA com **Vite + React + TS**.  
- Lista reativa de webhooks via polling.  
- Uso de **Shiki** para realce sintático.  

### 🧩 Aula 3 — Visualização Avançada e UX Reativa
- Implementação de **react-resizable-panels**.  
- Introdução de **Radix Dialog** e componentes de UI acessíveis.  
- Busca e filtragem reativa de payloads.  

### 🤖 Aula 4 — Integração com IA (Google Gemini)
- Implementação de `/ai/generate-schema`.  
- Comunicação com **Google Gemini Pro** via **Vercel AI SDK**.  
- Streaming em tempo real do schema gerado.  

---

## 📊 Banco de Dados (Drizzle ORM)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | string (cuid2) | Identificador único |
| webhook_inbox_id | string | Caixa de entrada |
| method | string | Método HTTP |
| headers | JSONB | Cabeçalhos capturados |
| query_params | JSONB | Parâmetros da query |
| body | JSONB | Payload completo |
| captured_at | timestamp | Momento da captura |

---

## 🧪 Estado Atual

- ✅ Backend funcional (Fastify + Drizzle + AI)  
- ✅ Frontend conectado (React + Vite + TanStack)  
- ✅ Streaming do Gemini ativo  
- ✅ UI responsiva e modular  
- 🔜 Editor JSON interativo  
- 🔜 Integração de histórico e exportação  

---

## 🚀 Próximas Etapas

- [ ] Adicionar histórico persistente de schemas gerados.  
- [ ] Implementar um “AI Playground” para prompts customizados.  
- [ ] Criar exportação direta `.ts` dos schemas gerados.  
- [ ] Melhorar animações e estados de carregamento.  

---

## 🧮 Execução Rápida

```bash
# Backend
cd packages/api
pnpm dev

# Banco de Dados (Docker)
docker-compose up -d

# Frontend
cd packages/web
pnpm dev
```

---

## 📎 Variáveis de Ambiente

```bash
PORT=3333
DATABASE_URL="postgres://user:password@localhost:5433/webhook_inspector"
GOOGLE_GEMINI_API_KEY="SUA_CHAVE_AQUI"
```

---

## 👨‍💻 Autor
**Leonardo Maximino Bernardo**  
Full-Stack Developer • Cientista de Dados • Professor de Física  
🧠 *Construindo sistemas que pensam e aprendem com você.*

---

## 🧾 Histórico Técnico (Commit Log Humano)
| Fase | Período | Marco |
|------|----------|-------|
| 1 | Out 2025 | Configuração do monorepo e Fastify |
| 2 | Out 2025 | Drizzle ORM + PostgreSQL + Migrações |
| 3 | Out–Nov 2025 | Frontend completo com polling |
| 4 | Nov 2025 | Integração de IA com Google Gemini |
| 5 | Nov 2025 | Polimento visual + streaming do schema |

> 💬 “Cada linha de código foi uma peça de um quebra-cabeça que ensina máquinas a entenderem máquinas.”  
> — **Leonardo Maximino Bernardo, 2025**
