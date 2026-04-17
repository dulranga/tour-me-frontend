import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import type { DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/driver/bids')({
  component: DriverBidsPage,
})

type DriverBid = {
  bidId: number
  driverId: number
  itineraryId: number
  bidAmount: number
  estimatedArrivalTime?: string
  notes?: string
  status: 'PENDING' | 'SELECTED' | 'DECLINED'
  submittedAt: string
}

function DriverBidsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  const {
    data: bids,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-bids', user.userId],
    queryFn: () => api<DriverBid[]>(`/bids/driver/${user.userId}`),
  })

  // Group bids by status
  const groupedBids = {
    pending: {
      title: 'Pending bids',
      description: 'Waiting for tourist response.',
      items: [] as DashboardListItem[],
    },
    selected: {
      title: 'Accepted bids',
      description: 'Trips that are confirmed.',
      items: [] as DashboardListItem[],
    },
    declined: {
      title: 'Declined bids',
      description: 'Bids that were not accepted.',
      items: [] as DashboardListItem[],
    },
  }

  if (bids) {
    bids.forEach((bid) => {
      const item: DashboardListItem = {
        id: bid.bidId.toString(),
        title: `Itinerary #${bid.itineraryId} - LKR ${bid.bidAmount}`,
        subtitle: bid.notes || 'No notes',
        meta: new Date(bid.submittedAt).toLocaleDateString(),
        status: bid.status,
        statusVariant:
          bid.status === 'PENDING'
            ? 'warning'
            : bid.status === 'SELECTED'
              ? 'success'
              : 'destructive',
      }

      if (bid.status === 'PENDING') {
        groupedBids.pending.items.push(item)
      } else if (bid.status === 'SELECTED') {
        groupedBids.selected.items.push(item)
      } else if (bid.status === 'DECLINED') {
        groupedBids.declined.items.push(item)
      }
    })
  }

  return (
    <DashboardShell
      title="Bids"
      subtitle="Track pending, accepted, and declined bids."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading bids...</p>}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load bids'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-3">
          <DashboardListCard {...groupedBids.pending} />
          <DashboardListCard {...groupedBids.selected} />
          <DashboardListCard {...groupedBids.declined} />
        </section>
      )}
    </DashboardShell>
  )
}
