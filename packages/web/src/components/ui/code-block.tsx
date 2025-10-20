// src/components/ui/code-block.tsx
import { codeToHtml } from 'shiki'
import { useEffect, useState } from 'react'
import { CopyButton } from './copy-button.js'

interface CodeBlockProps {
  code: string
  lang: 'json' | 'typescript'
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState('')

  useEffect(() => { /* ... mesma lógica de antes ... */ }, [code, lang])

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton textToCopy={code} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </div>
  )
}