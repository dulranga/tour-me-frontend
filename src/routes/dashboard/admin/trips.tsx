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

  return (
    <DashboardShell
      title="Trips"
      subtitle="Monitor active trips and completion confirmations."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">View trip details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trip details</DialogTitle>
              <DialogDescription>
                Inspect itinerary status and destinations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-trip-itinerary-id">Itinerary ID</Label>
                <Input id="admin-trip-itinerary-id" placeholder="ITIN-0001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-trip-pickup">Pickup location</Label>
                <Input id="admin-trip-pickup" placeholder="Colombo Fort" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-trip-destination">Destination</Label>
                <Input id="admin-trip-destination" placeholder="Galle" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-trip-status">Status</Label>
                <Input id="admin-trip-status" placeholder="InProgress" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </DialogClose>
              <Button type="button">Refresh details</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.inProgress} />
        <DashboardListCard {...data.awaitingConfirmation} />
      </section>
    </DashboardShell>
  )
}
