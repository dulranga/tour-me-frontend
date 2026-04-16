import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg-base',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent-teal text-white',
        secondary: 'border-transparent bg-bg-hover text-text-primary',
        outline: 'text-text-primary border-border-default',
        success: 'border-transparent bg-[var(--status-success)] text-white',
        warning: 'border-transparent bg-[var(--status-warning)] text-[#1a1a1a]',
        destructive: 'border-transparent bg-[var(--status-error)] text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
