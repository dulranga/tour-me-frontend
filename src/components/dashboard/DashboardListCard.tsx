import type { ReactNode } from 'react'

import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

/**
 * Represents a single item in the dashboard list
 */
type DashboardListItem = {
  id?: string
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusVariant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
}

/**
 * Props for the DashboardListCard component
 */
type DashboardListCardProps = {
  title: string
  description?: string
  items: DashboardListItem[]
  emptyState?: string
  className?: string
  headerAction?: ReactNode
  renderItemActions?: (item: DashboardListItem) => ReactNode
}

export function DashboardListCard({
  title,
  description,
  items,
  emptyState,
  className,
  headerAction,
  renderItemActions,
}: DashboardListCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">
            {emptyState ?? 'No items to show yet.'}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id ?? `${item.title}-${item.meta ?? ''}`}
              className={cn(
                'flex flex-col gap-3 rounded-md border border-border-subtle bg-bg-base/40 p-3'
              )}
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-primary">
                  {item.title}
                </p>
                {item.subtitle ? (
                  <p className="text-xs text-text-secondary">{item.subtitle}</p>
                ) : null}
                {item.meta ? (
                  <p className="mt-1 text-xs text-text-muted">{item.meta}</p>
                ) : null}
              </div>
              {item.status ? (
                <Badge
                  variant={item.statusVariant ?? 'secondary'}
                  className="w-fit"
                >
                  {item.status}
                </Badge>
              ) : null}
              {renderItemActions ? (
                <div className="flex justify-end gap-2">
                  {renderItemActions(item)}
                </div>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
