// packages/web/src/App.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState, useMemo, useEffect } from 'react'
import { CodeBlock } from './components/CodeBlock.js'
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog.js'
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels'

// Interface que define a "forma" dos nossos dados de webhook
interface Webhook {
  id: string
  method: string
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
  if (error) {
    return <div className="p-4 text-red-500">Erro ao buscar dados: {error.message}</div>
  }

  return (
    <PanelGroup direction="horizontal" className="h-screen bg-gray-50 font-sans">
      
      {/* PAINEL DA ESQUERDA: LISTA E CONTROLES */}
      <Panel defaultSize={33} minSize={20}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Webhooks Capturados</h1>
            <input
              type="text"
              placeholder="Buscar por ID ou no corpo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-2">
              {isLoading ? 'Buscando...' : `${filteredWebhooks.length} de ${webhooks?.length || 0} requisições`}
            </p>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {filteredWebhooks.map((webhook) => (
              <div key={webhook.id} className="flex items-center border-b border-gray-200 group">
                <button
                  onClick={() => setSelectedWebhookId(webhook.id)}
                  className={`flex-1 text-left p-4 focus:outline-none ${
                    selectedWebhookId === webhook.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-mono text-sm">{webhook.method}</p>
                  <p className="text-xs text-gray-600 truncate">ID: {webhook.id}</p>
                </button>
                <DeleteConfirmationDialog onConfirm={() => deleteWebhookMutation.mutate(webhook.id)}>
                  <button className="p-2 mr-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </button>
                </DeleteConfirmationDialog>
              </div>
            ))}
          </nav>
        </div>
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-500 transition-colors" />

      {/* PAINEL DA DIREITA: DETALHES */}
      <Panel minSize={30}>
        <main className="h-full p-6 overflow-y-auto">
          {selectedWebhook ? (
            <div>
              <h2 className="text-lg font-bold">Detalhes da Requisição</h2>
              <p className="text-sm text-gray-500 mb-4">
                Capturado em: {new Date(selectedWebhook.createdAt).toLocaleString()}
              </p>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Headers</h3>
                <CodeBlock
                  lang="json"
                  code={JSON.stringify(selectedWebhook.headers, null, 2)}
                />
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Body (Payload)</h3>
                <CodeBlock
                  lang="json"
                  code={JSON.stringify(selectedWebhook.body, null, 2)}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Selecione um webhook na lista para ver os detalhes.</p>
            </div>
          )}
        </main>
      </Panel>

    </PanelGroup>
  )
}

export default App