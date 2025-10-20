// packages/web/src/components/section-header.tsx
import { type ReactNode } from 'react'

interface SectionHeaderProps {
  children: ReactNode
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return <h3 className="font-semibold mb-2 text-gray-800">{children}</h3>
}