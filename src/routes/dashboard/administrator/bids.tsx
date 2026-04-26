import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/administrator/bids')({
  component: AdminBidsPage,
})

type Bid = {
  bidId: number
  itineraryId: number
  driverId: number
  bidAmount: number
  status: 'PENDING' | 'SELECTED' | 'DECLINED'
  submittedAt: string
}

type StalledItinerary = {
  itineraryId: number
  pickupLocation: string
  destination: string
  bidCount: number
  createdAt: string
}

function AdminBidsPage() {
  const { data: bids, isLoading: bidsLoading } = useQuery({
    queryKey: ['admin-bids'],
    queryFn: () => api<Bid[]>('/bids'),
  })

  const { data: stalledItineraries, isLoading: stalledLoading } = useQuery({
    queryKey: ['stalled-itineraries'],
    queryFn: () => api<StalledItinerary[]>('/itineraries?status=STALLED'),
  })

  const openBids = {
    title: 'Open bids',
    description: 'Active bids in the marketplace.',
    items: [] as DashboardListItem[],
  }

  if (bids) {
    bids
      .filter((b) => b.status === 'PENDING')
      .forEach((bid) => {
        openBids.items.push({
          id: bid.bidId.toString(),
          title: `Itinerary #${bid.itineraryId}`,
          subtitle: `Driver #${bid.driverId} - LKR ${bid.bidAmount}`,
          meta: new Date(bid.submittedAt).toLocaleDateString(),
          status: 'Pending',
          statusVariant: 'secondary',
        })
      })
  }

  const stalledData = {
    title: 'Stalled itineraries',
    description: 'Trips without accepted bids.',
    items: [] as DashboardListItem[],
  }

  if (stalledItineraries) {
    stalledItineraries.forEach((it) => {
      stalledData.items.push({
        id: it.itineraryId.toString(),
        title: `${it.pickupLocation} → ${it.destination}`,
        subtitle: `${it.bidCount} bids received`,
        meta: new Date(it.createdAt).toLocaleDateString(),
        status: 'Stalled',
        statusVariant: 'destructive',
      })
    })
  }

  const isLoading = bidsLoading || stalledLoading

  return (
    <DashboardShell
      title="Bids"
      subtitle="Monitor marketplace activity and stalled itineraries."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading bids...</p>}
      {!isLoading && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...openBids}
            headerAction={
              <Button size="sm" variant="outline" disabled>
                Export report
              </Button>
            }
          />
          <DashboardListCard {...stalledData} />
        </section>
      )}
    </DashboardShell>
  )
}
