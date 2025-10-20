// packages/web/src/components/skeleton.tsx
import { type ComponentProps } from 'react'
import { clsx } from 'clsx'

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={clsx('bg-gray-200/60 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}