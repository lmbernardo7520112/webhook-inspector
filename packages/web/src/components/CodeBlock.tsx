// packages/web/src/components/CodeBlock.tsx
import { codeToHtml } from 'shiki'
import { useEffect, useState } from 'react'

interface CodeBlockProps {
  code: string
  lang: 'json' | 'bash' // Podemos expandir para outras linguagens
}

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState('')

  useEffect(() => {
    // A função que renderiza o código é assíncrona
    async function highlight() {
      const html = await codeToHtml(code, {
        lang,
        theme: 'github-dark', // Um tema popular e legível. Shiki tem dezenas.
      })
      setHighlightedCode(html)
    }

    highlight()
  }, [code, lang]) // Re-executa o efeito se o código ou a linguagem mudar

  if (!highlightedCode) {
    // Mostra o código sem formatação enquanto o Shiki processa
    return (
      <pre className="p-4 bg-gray-800 text-white rounded-md text-sm overflow-x-auto">
        <code>{code}</code>
      </pre>
    )
  }

  // `dangerouslySetInnerHTML` é seguro aqui porque a saída do Shiki já é sanitizada.
  return (
    <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
  )
}