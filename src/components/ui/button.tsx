import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default:
          'bg-accent-teal hover:bg-accent-blue text-white focus-visible:ring-accent-teal',
        destructive:
          'bg-accent-red hover:bg-red-600 text-white focus-visible:ring-accent-red',
        outline:
          'border border-border-default bg-bg-elevated hover:bg-bg-hover text-text-primary focus-visible:ring-accent-teal',
        secondary:
          'bg-neutral-800 hover:bg-neutral-700 text-text-primary focus-visible:ring-accent-teal',
        ghost:
          'hover:bg-bg-hover text-text-primary focus-visible:ring-accent-teal',
        link: 'text-accent-teal underline-offset-4 hover:underline focus-visible:ring-accent-teal',
      },
      size: {
        default: 'h-10 px-4 py-2 text-base',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
