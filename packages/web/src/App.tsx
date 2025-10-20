// packages/web/src/App.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useMemo, useEffect } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Trash2 } from 'lucide-react'

// Importações dos nossos componentes de UI, agora com os caminhos corretos
import { AiSchemaDialog } from './components/AiSchemaDialog.js'
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog.js'
import { Badge } from './components/ui/badge.js'
import { CodeBlock } from './components/ui/code-block.js'
import { EmptyState } from './components/ui/empty-state.js'
import { IconButton } from './components/ui/icon-button.js'
import { KeyValueTable } from './components/ui/key-value-table.js'
import { Logo } from './components/ui/logo.js'
import { MetadataRow } from './components/ui/metadata-row.js'
import { SectionHeader } from './components/ui/section-header.js'
import { Skeleton } from './components/ui/skeleton.js'

// Interface que define a "forma" dos nossos dados de webhook
interface Webhook {
  id: string
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' // Tipagem mais estrita para o Badge
  createdAt: string
  headers: Record<string, any>
  body: Record<string, any>
}

function App() {
  // --- ESTADO DA UI ---
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const queryClient = useQueryClient()

  // --- BUSCA DE DADOS (DATA FETCHING) ---
  const { data: webhooks, isLoading, error } = useQuery<Webhook[]>({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3333/webhooks')
      return response.data
    },
    refetchInterval: 2000,
  })

  // --- ORQUESTRADOR DE MUTAÇÃO (DATA MUTATION) ---
  const deleteWebhookMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      await axios.delete(`http://localhost:3333/webhooks/${webhookId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] })
    },
  })

  // --- ESTADO DERIVADO E EFEITOS ---
  const filteredWebhooks = useMemo(() => {
    if (!webhooks) return []
    const query = searchQuery.toLowerCase()
    if (!query) return webhooks
    return webhooks.filter(webhook => {
      const bodyString = JSON.stringify(webhook.body).toLowerCase()
      return webhook.id.toLowerCase().includes(query) || bodyString.includes(query)
    })
  }, [webhooks, searchQuery])

  const selectedWebhook = useMemo(() => {
    if (!selectedWebhookId || !webhooks) return null
    return webhooks.find(wh => wh.id === selectedWebhookId) || null
  }, [selectedWebhookId, webhooks])

  useEffect(() => {
    if (selectedWebhookId && !filteredWebhooks.some(wh => wh.id === selectedWebhookId)) {
      setSelectedWebhookId(null)
    }
  }, [filteredWebhooks, selectedWebhookId])

  // --- RENDERIZAÇÃO ---
  if (isLoading) {
    // Tela de Carregamento com Esqueletos e Tema Dark
    return (
      <div className="bg-zinc-900 text-zinc-50 min-h-screen font-sans flex">
        <aside className="w-1/3 border-r border-zinc-800 p-4 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </aside>
        <main className="w-2/3 p-6 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
          <div className="space-y-2 pt-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return <div className="p-4 text-red-500 bg-red-950 min-h-screen">Erro ao buscar dados: {error.message}</div>
  }

  return (
    <div className="bg-zinc-900 text-zinc-50 min-h-screen font-sans">
      <PanelGroup direction="horizontal">
        {/* PAINEL DA ESQUERDA: LISTA E CONTROLES */}
        <Panel defaultSize={33} minSize={20} className="p-4 flex flex-col">
          <Logo />
          <input
            type="text"
            placeholder="Buscar por ID ou no corpo..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full mt-4 p-2 bg-zinc-800 border border-zinc-700 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <p className="text-sm text-zinc-400 mt-2">
            {`${filteredWebhooks.length} de ${webhooks?.length || 0} requisições`}
          </p>

          <nav className="flex-1 mt-4 space-y-1 overflow-y-auto pr-2">
            {filteredWebhooks.length > 0 ? (
              filteredWebhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center group relative">
                  {selectedWebhookId === webhook.id && (
                    <div className="absolute left-[-1rem] h-6 w-1 bg-green-400 rounded-r-full" />
                  )}
                  <button onClick={() => setSelectedWebhookId(webhook.id)} className={`w-full flex items-center gap-3 p-2 rounded-md ${selectedWebhookId === webhook.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}>
                    <Badge method={webhook.method} />
                    <span className="font-mono text-sm text-zinc-400">/webhooks</span>
                  </button>
                  <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DeleteConfirmationDialog onConfirm={() => deleteWebhookMutation.mutate(webhook.id)}>
                      <IconButton><Trash2 className="h-4 w-4" /></IconButton>
                    </DeleteConfirmationDialog>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState>
                {searchQuery ? `Nenhum resultado para "${searchQuery}".` : 'Nenhum webhook capturado ainda.'}
              </EmptyState>
            )}
          </nav>
        </Panel>

        <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-green-400 transition-colors" />

        {/* PAINEL DA DIREITA: DETALHES */}
        <Panel minSize={30}>
          <main className="h-full p-6 overflow-y-auto">
            {selectedWebhook ? (
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Detalhes da Requisição</h2>
                    <MetadataRow label="Capturado em" value={new Date(selectedWebhook.createdAt).toLocaleString()} />
                  </div>
                  <AiSchemaDialog jsonPayload={JSON.stringify(selectedWebhook.body)}>
                    <button className="px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 font-semibold">
                      Gerar Schema Zod
                    </button>
                  </AiSchemaDialog>
                </div>
                
                <div className="mt-8">
                  <SectionHeader>Headers</SectionHeader>
                  <KeyValueTable data={selectedWebhook.headers} />
                </div>
                
                <div className="mt-6">
                  <SectionHeader>Request Body</SectionHeader>
                  <CodeBlock
                    lang="json"
                    code={JSON.stringify(selectedWebhook.body, null, 2)}
                  />
                </div>
              </div>
            ) : (
              <EmptyState>
                Selecione um webhook na lista para ver os detalhes.
              </EmptyState>
            )}
          </main>
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default App