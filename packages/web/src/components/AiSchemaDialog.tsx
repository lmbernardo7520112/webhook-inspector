import * as Dialog from '@radix-ui/react-dialog'
import { useRef, useState, type ReactNode } from 'react'
import { CodeBlock } from './CodeBlock.js'

interface AiSchemaDialogProps {
  children: ReactNode
  jsonPayload: string
}

export function AiSchemaDialog({ children, jsonPayload }: AiSchemaDialogProps) {
  const [assistantMessage, setAssistantMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)

  function handleOpenChange(open: boolean) {
    if (open) {
      setAssistantMessage('')
      setLoading(true)
      controllerRef.current = new AbortController()
      fetch('http://localhost:3333/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonPayload }),
        signal: controllerRef.current.signal
      }).then(response => {
        if (!response.ok) throw new Error('Network error')
        if (!response.body) throw new Error('No body')
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) {
              setLoading(false)
              return
            }
            const chunk = decoder.decode(value)
            setAssistantMessage(prev => prev + chunk)
            read()
          }).catch(err => {
            if (err.name !== 'AbortError') console.error(err)
            setLoading(false)
          })
        }
        read()
      }).catch(err => {
        if (err.name !== 'AbortError') console.error(err)
        setLoading(false)
      })
    } else {
      controllerRef.current?.abort()
      setLoading(false)
    }
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 h-[85vh] w-[90vw] max-w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none flex flex-col">
          <Dialog.Title className="text-lg font-bold">
            Schema Zod Gerado por IA
          </Dialog.Title>
          <div className="flex-1 mt-4 overflow-y-auto">
            {assistantMessage ? (
              <CodeBlock lang="json" code={assistantMessage} />
            ) : (
              <p>{loading ? 'Gerando schema...' : 'Analisando payload e gerando schema...'}</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}