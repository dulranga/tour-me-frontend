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

type Trip = {
  tripId: number
  itineraryId: number
  driverId: number
  driverName: string
  driverEmail: string
  pickupLocation: string
  destination: string
  agreedPrice: number
  status: string
  vehicleDetails: string
}

type ApiResponse<T> = {
  data: T
  message: string
  status: string
  success: boolean
}

function DriverTripsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  // Fetch driver's confirmed trips
  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-trips', user.userId],
    queryFn: () => api<Trip[]>(`/trips/driver/${user.userId}`),
  })

  // Filter confirmed trips
  const confirmedTrips: DashboardListData = {
    title: 'Confirmed trips',
    description: 'Trips matched with tourists.',
    items: [] as DashboardListItem[],
  }

  if (trips) {
    trips.forEach((trip) => {
      confirmedTrips.items.push({
        id: trip.tripId.toString(),
        title: `${trip.pickupLocation} → ${trip.destination}`,
        subtitle: `Price: LKR ${trip.agreedPrice} | Vehicle: ${trip.vehicleDetails}`,
        meta: trip.status,
        status: trip.status,
        statusVariant: trip.status === 'CONFIRMED' ? 'success' : 'secondary',
      })
    })
  }

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
          {error instanceof Error ? error.message : 'Failed to load trips'}
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
