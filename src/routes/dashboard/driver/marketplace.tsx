import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverMarketplaceData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/marketplace')({
  component: DriverMarketplacePage,
})

function DriverMarketplacePage() {
  const data = getDriverMarketplaceData()

  return (
    <DashboardShell
      title="Marketplace"
      subtitle="Browse itineraries that match your routes and availability."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Submit bid</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit bid</DialogTitle>
              <DialogDescription>
                Provide your pricing details for the selected itinerary.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="marketplace-itinerary-id">Itinerary ID</Label>
                <Input
                  id="marketplace-itinerary-id"
                  placeholder="ITIN-0001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="marketplace-pickup">Pickup location</Label>
                <Input
                  id="marketplace-pickup"
                  placeholder="Colombo Fort"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="marketplace-destination">Destination</Label>
                <Input
                  id="marketplace-destination"
                  placeholder="Galle"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="marketplace-amount">Bid amount</Label>
                <Input id="marketplace-amount" type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="marketplace-status">Status</Label>
                <Input id="marketplace-status" value="Submitted" readOnly />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Submit bid</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.matches} />
        <DashboardListCard {...data.expiringSoon} />
        <DashboardListCard {...data.newest} />
      </section>
    </DashboardShell>
  )
}
