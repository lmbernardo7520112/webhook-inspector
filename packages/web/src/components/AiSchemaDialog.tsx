// packages/web/src/components/AiSchemaDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.js'
import { useState, type ReactNode } from 'react'
import { CodeBlock } from './ui/code-block.js' // Caminho corrigido

interface AiSchemaDialogProps {
  children: ReactNode
  jsonPayload: string
}

export function AiSchemaDialog({ children, jsonPayload }: AiSchemaDialogProps) {
  const [generatedSchema, setGeneratedSchema] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerateSchema() {
    setIsLoading(true)
    setError(null)
    setGeneratedSchema(null)

    try {
      const response = await fetch('http://localhost:3333/ai/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonPayload }),
      })

      if (!response.ok) throw new Error('Falha na requisição ao servidor')
      if (!response.body) throw new Error('Resposta do servidor sem corpo.')
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      let result = ''
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        result += (chunk)
        setGeneratedSchema(result)
      }
    } catch (err: any) {
      console.error('Falha ao gerar schema:', err)
      setError(err.message || 'Não foi possível gerar o schema.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      handleGenerateSchema()
    } else {
      setGeneratedSchema(null)
      setError(null)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* O DialogContent já inclui Portal e Overlay, simplificando o código */}
      <DialogContent className="h-[85vh] max-w-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Schema Zod Gerado por IA</DialogTitle>
          <DialogDescription className="sr-only">
            Um schema Zod gerado por inteligência artificial com base no payload do seu webhook.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 mt-4 overflow-y-auto">
          {isLoading && !generatedSchema && (
            <div className="flex items-center justify-center h-full text-zinc-400">
              <p>Analisando payload e gerando schema...</p>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {generatedSchema && (
            <CodeBlock lang="typescript" code={generatedSchema} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}