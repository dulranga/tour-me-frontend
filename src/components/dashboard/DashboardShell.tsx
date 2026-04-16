import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

import { Badge } from '#/components/ui/badge'
import { Card } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type DashboardNavItem = {
  label: string
  description?: string
  to?: string
}

type DashboardShellProps = {
  title: string
  subtitle?: string
  roleLabel: string
  navItems: DashboardNavItem[]
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function DashboardShell({
  title,
  subtitle,
  roleLabel,
  navItems,
  actions,
  children,
  className,
}: DashboardShellProps) {
  return (
    <main className={cn('bg-bg-base', className)}>
      <div className="page-wrap px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-4">
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Navigation
              </p>
              <nav className="mt-4 flex flex-col gap-2">
                {navItems.map((item) => {
                  const baseClass =
                    'rounded-md border border-border-subtle px-3 py-2 text-left transition-colors'
                  const labelClass = 'text-sm font-medium text-text-primary'
                  const descriptionClass = 'text-xs text-text-muted'

                  if (item.to) {
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        className={cn(
                          baseClass,
                          'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                        )}
                        activeProps={{
                          className: 'bg-bg-hover text-text-primary border-border-default',
                        }}
                      >
                        <div className={labelClass}>{item.label}</div>
                        {item.description ? (
                          <div className={descriptionClass}>{item.description}</div>
                        ) : null}
                      </Link>
                    )
                  }

                  return (
                    <div
                      key={item.label}
                      className={cn(baseClass, 'cursor-not-allowed opacity-60')}
                    >
                      <div className={labelClass}>{item.label}</div>
                      {item.description ? (
                        <div className={descriptionClass}>{item.description}</div>
                      ) : null}
                    </div>
                  )
                })}
              </nav>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
                Account
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-text-primary">
                  Signed in as {roleLabel}
                </p>
                <p className="text-xs text-text-secondary">
                  Demo view for the dashboard layout
                </p>
                <Badge variant="secondary" className="mt-2">
                  Theme synced
                </Badge>
              </div>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge variant="outline">{roleLabel}</Badge>
                <h1 className="mt-3 text-3xl font-semibold text-text-primary">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-2 max-w-2xl text-sm text-text-secondary">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {actions ? (
                <div className="flex flex-wrap gap-2">{actions}</div>
              ) : null}
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  )
}
