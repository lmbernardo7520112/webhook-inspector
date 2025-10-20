// packages/web/src/components/ui/badge.tsx
import { type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const badgeVariants = tv({
  base: 'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold',
  variants: {
    method: {
      GET: 'border-transparent bg-blue-500 text-blue-50',
      POST: 'border-transparent bg-green-500 text-green-50',
      DELETE: 'border-transparent bg-red-500 text-red-50',
      PUT: 'border-transparent bg-yellow-500 text-yellow-50', // <-- ADICIONADO
      PATCH: 'border-transparent bg-orange-500 text-orange-50', // <-- ADICIONADO
    },
  },
  defaultVariants: {
    method: 'GET',
  },
})

export interface BadgeProps extends ComponentProps<'div'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, method, ...props }: BadgeProps) {
  return <div className={badgeVariants({ method, className })} {...props} />
}