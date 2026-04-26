import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'

export const Route = createFileRoute('/dashboard/tourist/trips')({
  component: TouristTripsPage,
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

function TouristTripsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  // Fetch user's confirmed trips
  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-trips', user.userId],
    queryFn: () => api<Trip[]>(`/trips/tourist/${user.userId}`),
  })

  // Group trips by status
  const groupedTrips = {
    upcoming: {
      title: 'Upcoming trips',
      description: 'Trips scheduled with drivers.',
      items: [] as DashboardListItem[],
    },
    completed: {
      title: 'Completed trips',
      description: "Trips you've finished.",
      items: [] as DashboardListItem[],
    },
  }

  if (trips) {
    trips.forEach((trip) => {
      const item: DashboardListItem = {
        id: trip.tripId.toString(),
        title: `${trip.pickupLocation} → ${trip.destination}`,
        subtitle: `Driver: ${trip.driverName} | Price: LKR ${trip.agreedPrice}`,
        meta: trip.status,
        status: trip.status,
        statusVariant:
          trip.status === 'CONFIRMED'
            ? 'success'
            : trip.status === 'COMPLETED'
              ? 'success'
              : 'outline',
      }

      if (trip.status === 'CONFIRMED' || trip.status === 'IN_PROGRESS') {
        groupedTrips.upcoming.items.push(item)
      } else if (trip.status === 'COMPLETED') {
        groupedTrips.completed.items.push(item)
      }
    })
  }

  const renderTripDetailsAction = (item: DashboardListItem) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trip details</DialogTitle>
          <DialogDescription>{item.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Route</span>
            <span className="text-sm font-medium">{item.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Status</span>
            <span className="text-sm font-medium">{item.status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Date</span>
            <span className="text-sm font-medium">{item.meta}</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <DashboardShell
      title="Trips"
      subtitle="Monitor upcoming and completed trips with drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading trips...</p>}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load trips'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard {...groupedTrips.upcoming} />
          <DashboardListCard
            {...groupedTrips.completed}
            renderItemActions={renderTripDetailsAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
