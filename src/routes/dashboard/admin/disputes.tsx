import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/admin/disputes')({
  component: AdminDisputesPage,
})

type Dispute = {
  disputeId: number
  tripId: number
  reportedBy: string
  issue: string
  status: 'OPEN' | 'RESOLVED' | 'ESCALATED'
  createdAt: string
}

function AdminDisputesPage() {
  const {
    data: disputes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: () => api<Dispute[]>('/disputes'),
  })

  const groupedDisputes = {
    openDisputes: {
      title: 'Open disputes',
      description: 'Awaiting resolution.',
      items: [] as DashboardListItem[],
    },
    resolved: {
      title: 'Resolved disputes',
      description: 'Closed cases.',
      items: [] as DashboardListItem[],
    },
  }

  if (disputes) {
    disputes.forEach((dispute) => {
      const item: DashboardListItem = {
        id: dispute.disputeId.toString(),
        title: `Trip #${dispute.tripId}`,
        subtitle: dispute.issue,
        meta: new Date(dispute.createdAt).toLocaleDateString(),
        status: dispute.status,
        statusVariant:
          dispute.status === 'OPEN'
            ? 'destructive'
            : dispute.status === 'RESOLVED'
              ? 'success'
              : 'warning',
      }

      if (dispute.status === 'OPEN' || dispute.status === 'ESCALATED') {
        groupedDisputes.openDisputes.items.push(item)
      } else {
        groupedDisputes.resolved.items.push(item)
      }
    })
  }

  const renderDisputeAction = () => (
    <Button size="sm" variant="outline" disabled>
      View dispute
    </Button>
  )

  return (
    <DashboardShell
      title="Disputes"
      subtitle="Resolve issues reported by tourists and drivers."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading disputes...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load disputes'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...groupedDisputes.openDisputes}
            renderItemActions={renderDisputeAction}
          />
          <DashboardListCard
            {...groupedDisputes.resolved}
            renderItemActions={renderDisputeAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
