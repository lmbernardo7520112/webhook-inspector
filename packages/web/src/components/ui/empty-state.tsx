// packages/web/src/components/empty-state.tsx
import { type ReactNode } from 'react'

interface EmptyStateProps {
  children: ReactNode
}

export function EmptyState({ children }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 text-center px-6">
      <p>{children}</p>
    </div>
  )
}