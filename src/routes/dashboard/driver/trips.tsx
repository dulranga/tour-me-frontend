import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/driver/trips')({
  component: DriverTripsPage,
})

type Itinerary = {
  itineraryId: number
  touristId: number
  pickupLocation: string
  destination: string
  pickupTime: string
  estimatedDuration: number
  maxBudget: number
  numberOfPassengers: number
  status: string
  createdAt: string
}

type DriverBid = {
  bidId: number
  driverId: number
  itineraryId: number
  bidAmount: number
  status: 'PENDING' | 'SELECTED' | 'DECLINED'
  submittedAt: string
}

function DriverTripsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  // Fetch all itineraries
  const { data: allItineraries, isLoading: itinerariesLoading } = useQuery({
    queryKey: ['all-itineraries'],
    queryFn: () => api<Itinerary[]>('/itineraries'),
  })

  // Fetch user's bids
  const { data: userBids, isLoading: bidsLoading } = useQuery({
    queryKey: ['driver-bids', user.userId],
    queryFn: () => api<DriverBid[]>(`/bids/driver/${user.userId}`),
  })

  // Filter confirmed trips (where user has a SELECTED bid)
  const confirmedTrips: DashboardListData = {
    title: 'Confirmed trips',
    description: 'Trips matched with tourists.',
    items: [] as DashboardListItem[],
  }

  if (allItineraries && userBids) {
    // Get all itinerary IDs where user has a SELECTED bid
    const selectedBidItineraryIds = new Set(
      userBids
        .filter((bid) => bid.status === 'SELECTED')
        .map((bid) => bid.itineraryId),
    )

    // Filter itineraries
    allItineraries
      .filter((itinerary) => selectedBidItineraryIds.has(itinerary.itineraryId))
      .forEach((itinerary) => {
        const bid = userBids.find(
          (b) =>
            b.itineraryId === itinerary.itineraryId && b.status === 'SELECTED',
        )
        confirmedTrips.items.push({
          id: itinerary.itineraryId.toString(),
          title: `${itinerary.pickupLocation} → ${itinerary.destination}`,
          subtitle: `${itinerary.numberOfPassengers} passenger${itinerary.numberOfPassengers > 1 ? 's' : ''}`,
          meta: new Date(itinerary.pickupTime).toLocaleDateString(),
          status: 'Confirmed',
          statusVariant: 'success',
        })
      })
  }

  const isLoading = itinerariesLoading || bidsLoading
  const isError = false

  return (
    <DashboardShell
      title="Trips"
      subtitle="Manage upcoming and completed trips."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading trips...</p>}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          Failed to load trips
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-1">
          <DashboardListCard {...confirmedTrips} />
        </section>
      )}
    </DashboardShell>
  )
}
