import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminTripsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/dashboard/admin/trips')({
  component: AdminTripsPage,
})

function AdminTripsPage() {
  const data = getAdminTripsData()
  const renderTripDetailsAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
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
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`admin-trip-pickup-${itemKey}`}>
                Pickup location
              </Label>
              <Input
                id={`admin-trip-pickup-${itemKey}`}
                placeholder="Pickup location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`admin-trip-destination-${itemKey}`}>
                Destination
              </Label>
              <Input
                id={`admin-trip-destination-${itemKey}`}
                placeholder="Destination"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`admin-trip-status-${itemKey}`}>Status</Label>
              <Input
                id={`admin-trip-status-${itemKey}`}
                placeholder="ACTIVE"
              />
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
  }

  return (
    <DashboardShell
      title="Trips"
      subtitle="Monitor active trips and completion confirmations."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.inProgress}
          renderItemActions={renderTripDetailsAction}
        />
        <DashboardListCard
          {...data.awaitingConfirmation}
          renderItemActions={renderTripDetailsAction}
        />
      </section>
    </DashboardShell>
  )
}
