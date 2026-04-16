import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type DashboardListItem = {
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusVariant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive'
}

type DashboardListCardProps = {
  title: string
  description?: string
  items: DashboardListItem[]
  emptyState?: string
  className?: string
}

export function DashboardListCard({
  title,
  description,
  items,
  emptyState,
  className,
}: DashboardListCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-text-muted">
            {emptyState ?? 'No items to show yet.'}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={`${item.title}-${item.meta ?? ''}`}
              className={cn(
                'flex items-start justify-between gap-3 rounded-md border border-border-subtle bg-bg-base/40 p-3'
              )}
            >
              <div>
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
                <Badge variant={item.statusVariant ?? 'secondary'}>
                  {item.status}
                </Badge>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
