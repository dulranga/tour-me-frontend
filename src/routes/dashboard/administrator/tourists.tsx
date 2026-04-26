import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute(
  '/dashboard/administrator/tourists',
)({
  component: AdminTouristsPage,
})

type Tourist = {
  userId: number
  name: string
  email: string
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
  totalTrips: number
  createdAt: string
}

function AdminTouristsPage() {
  const {
    data: tourists,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-tourists'],
    queryFn: () => api<Tourist[]>('/tourists'),
  })

  const groupedTourists = {
    activeTourists: {
      title: 'Active tourists',
      description: 'Users with recent activity.',
      items: [] as DashboardListItem[],
    },
    flagged: {
      title: 'Flagged accounts',
      description: 'Requiring review.',
      items: [] as DashboardListItem[],
    },
  }

  if (tourists) {
    tourists.forEach((tourist) => {
      const item: DashboardListItem = {
        id: tourist.userId.toString(),
        title: tourist.name,
        subtitle: tourist.email,
        meta: `${tourist.totalTrips} trips`,
        status: tourist.status,
        statusVariant:
          tourist.status === 'ACTIVE'
            ? 'success'
            : tourist.status === 'SUSPENDED'
              ? 'destructive'
              : 'outline',
      }

      if (tourist.status === 'SUSPENDED') {
        groupedTourists.flagged.items.push(item)
      } else {
        groupedTourists.activeTourists.items.push(item)
      }
    })
  }

  const renderReportAction = () => (
    <Button size="sm" variant="outline" disabled>
      View report
    </Button>
  )

  return (
    <DashboardShell
      title="Tourists"
      subtitle="Review tourist accounts and recent activity."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading tourists...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load tourists'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...groupedTourists.activeTourists}
            renderItemActions={renderReportAction}
          />
          <DashboardListCard
            {...groupedTourists.flagged}
            renderItemActions={renderReportAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
