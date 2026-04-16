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
  const renderCreateItineraryAction = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Create itinerary</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create itinerary</DialogTitle>
          <DialogDescription>
            Add pickup and destination details for a new trip.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-pickup">Pickup location</Label>
            <Input
              id="tourist-itinerary-create-pickup"
              placeholder="Colombo Fort"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-destination">
              Destination
            </Label>
            <Input
              id="tourist-itinerary-create-destination"
              placeholder="Kandy"
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
  )
  const renderUpdateItineraryAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update itinerary
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update itinerary</DialogTitle>
            <DialogDescription>
              Update pickup, destination, or status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-itinerary-pickup-${itemKey}`}>
                Pickup location
              </Label>
              <Input
                id={`tourist-itinerary-pickup-${itemKey}`}
                placeholder="Pickup location"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`tourist-itinerary-destination-${itemKey}`}>
                Destination
              </Label>
              <Input
                id={`tourist-itinerary-destination-${itemKey}`}
                placeholder="Destination"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`tourist-itinerary-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-itinerary-status-${itemKey}`}
                placeholder="PENDING"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Itineraries"
      subtitle="Manage draft plans, open bids, and confirmed itineraries."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...data.drafts}
          headerAction={renderCreateItineraryAction()}
          renderItemActions={renderUpdateItineraryAction}
        />
        <DashboardListCard
          {...data.openForBids}
          renderItemActions={renderUpdateItineraryAction}
        />
        <DashboardListCard
          {...data.confirmed}
          renderItemActions={renderUpdateItineraryAction}
        />
      </section>
    </DashboardShell>
  )
}
