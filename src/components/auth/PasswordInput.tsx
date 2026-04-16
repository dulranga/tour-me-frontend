import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Input, type InputProps } from '#/components/ui/input'
import { cn } from '#/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          className={cn('pr-11', className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-text-muted transition hover:text-text-primary"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
