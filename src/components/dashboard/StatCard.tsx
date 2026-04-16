import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type StatCardProps = {
  title: string
  value: string
  description: string
  icon?: ReactNode
  trend?: string
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <div className="mt-2 text-3xl font-semibold text-text-primary">
            {value}
          </div>
        </div>
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-subtle bg-bg-base text-text-primary">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-text-muted">{description}</p>
        {trend ? (
          <p className="mt-2 text-xs font-semibold text-text-secondary">
            {trend}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
