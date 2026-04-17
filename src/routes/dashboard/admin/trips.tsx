import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
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

export const Route = createFileRoute('/dashboard/admin/trips')({
  component: AdminTripsPage,
})

type Trip = {
  tripId: number
  itineraryId: number
  pickupLocation: string
  destination: string
  pickupTime: string
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

function AdminTripsPage() {
  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-trips'],
    queryFn: () => api<Trip[]>('/trips'),
  })

  const tripMonitoring = {
    title: 'All trips',
    description: 'Platform trip monitoring.',
    items: [] as DashboardListItem[],
  }

  if (trips) {
    trips.forEach((trip) => {
      tripMonitoring.items.push({
        id: trip.tripId.toString(),
        title: `${trip.pickupLocation} → ${trip.destination}`,
        subtitle: `Trip #${trip.tripId}`,
        meta: new Date(trip.pickupTime).toLocaleDateString(),
        status: trip.status,
        statusVariant:
          trip.status === 'COMPLETED'
            ? 'success'
            : trip.status === 'IN_PROGRESS'
              ? 'secondary'
              : trip.status === 'CANCELLED'
                ? 'destructive'
                : 'outline',
      })
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
          <DialogDescription>
            Review itinerary details for {item.title}.
          </DialogDescription>
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
      subtitle="Monitor all trips across the platform."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading trips...</p>}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load trips'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6">
          <DashboardListCard
            {...tripMonitoring}
            renderItemActions={renderTripDetailsAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
