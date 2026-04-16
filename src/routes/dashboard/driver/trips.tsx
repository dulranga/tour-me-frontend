import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverTripsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/trips')({
  component: DriverTripsPage,
})

function DriverTripsPage() {
  const data = getDriverTripsData()

  return (
    <DashboardShell
      title="Trips"
      subtitle="Manage upcoming and completed trips."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Confirm completion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm trip completion</DialogTitle>
              <DialogDescription>
                Update the itinerary status to completed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver-completion-itinerary">Itinerary ID</Label>
                <Input
                  id="driver-completion-itinerary"
                  placeholder="ITIN-0001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-completion-status">Status</Label>
                <Input
                  id="driver-completion-status"
                  value="Completed"
                  readOnly
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Confirm completion</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.upcoming} />
        <DashboardListCard {...data.completed} />
      </section>
    </DashboardShell>
  )
}
