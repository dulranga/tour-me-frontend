import * as React from 'react'

import { cn } from '#/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-border-default bg-bg-elevated px-3 py-2 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-teal focus:ring-2 focus:ring-accent-teal/20 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
