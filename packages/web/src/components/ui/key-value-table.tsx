// src/components/ui/key-value-table.tsx
interface KeyValueTableProps {
  data: Record<string, any>
}

export function KeyValueTable({ data }: KeyValueTableProps) {
  return (
    <div className="divide-y divide-zinc-700 border border-zinc-700 rounded-lg">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex items-center text-sm p-2">
          <span className="w-1/3 text-zinc-400">{key}</span>
          <span className="flex-1 font-mono text-zinc-50">{String(value)}</span>
        </div>
      ))}
    </div>
  )
}