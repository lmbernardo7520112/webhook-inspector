// src/components/ui/icon-button.tsx
import { type ComponentProps } from 'react'

export function IconButton(props: ComponentProps<'button'>) {
  return (
    <button
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
      {...props}
    />
  )
}