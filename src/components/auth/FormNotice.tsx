import * as React from 'react'

import { cn } from '#/lib/utils'

type FormNoticeProps = {
  title: string
  description?: string
  variant?: 'info' | 'success' | 'warning'
}

const variantStyles: Record<NonNullable<FormNoticeProps['variant']>, string> = {
  info: 'border-border-default text-text-secondary',
  success: 'border-[var(--status-success)] text-[var(--status-success)]',
  warning: 'border-[var(--status-warning)] text-[var(--status-warning)]',
}

export default function FormNotice({
  title,
  description,
  variant = 'info',
}: FormNoticeProps) {
  return (
    <div
      className={cn(
        'rounded-md border bg-bg-hover/60 px-4 py-3 text-sm',
        variantStyles[variant]
      )}
    >
      <p className="font-semibold">{title}</p>
      {description ? (
        <p className="mt-1 text-xs text-text-muted">{description}</p>
      ) : null}
    </div>
  )
}
