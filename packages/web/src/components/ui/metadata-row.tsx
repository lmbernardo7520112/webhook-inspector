// packages/web/src/components/metadata-row.tsx
interface MetadataRowProps {
  label: string
  value: string
}

export function MetadataRow({ label, value }: MetadataRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-mono text-gray-800">{value}</span>
    </div>
  )
}