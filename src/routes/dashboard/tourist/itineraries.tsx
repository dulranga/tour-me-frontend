import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristItinerariesData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/itineraries')({
  component: TouristItinerariesPage,
})

function TouristItinerariesPage() {
  const data = getTouristItinerariesData()

  return (
    <DashboardShell
      title="Itineraries"
      subtitle="Manage draft plans, open bids, and confirmed itineraries."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">New itinerary</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create itinerary</DialogTitle>
              <DialogDescription>
                Add destinations and dates for a new trip.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tourist-itinerary-page-pickup">
                  Pickup location
                </Label>
                <Input
                  id="tourist-itinerary-page-pickup"
                  placeholder="Colombo Fort"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-itinerary-page-destination">
                  Destination
                </Label>
                <Input
                  id="tourist-itinerary-page-destination"
                  placeholder="Kandy"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-itinerary-page-start">Start date</Label>
                <Input id="tourist-itinerary-page-start" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-itinerary-page-end">End date</Label>
                <Input id="tourist-itinerary-page-end" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-itinerary-page-stays">
                  Overnight stays
                </Label>
                <Input
                  id="tourist-itinerary-page-stays"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Create itinerary</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.drafts} />
        <DashboardListCard {...data.openForBids} />
        <DashboardListCard {...data.confirmed} />
      </section>
    </DashboardShell>
  )
}
