import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Handshake, MapPin, Receipt } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristOverviewData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
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

export const Route = createFileRoute('/dashboard/tourist/')({
  component: TouristDashboard,
})

function TouristDashboard() {
  const data = getTouristOverviewData()
  const iconMap = {
    'map-pin': MapPin,
    handshake: Handshake,
    calendar: Calendar,
    receipt: Receipt,
  }
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
            <Label htmlFor="tourist-itinerary-pickup">Pickup location</Label>
            <Input
              id="tourist-itinerary-pickup"
              placeholder="Colombo Fort"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-destination">Destination</Label>
            <Input
              id="tourist-itinerary-destination"
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
  const renderBidUpdateAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update bid
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update bid status</DialogTitle>
            <DialogDescription>
              Update the status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-bid-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-bid-status-${itemKey}`}
                placeholder="ACCEPTED"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  const renderTripStatusAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update status
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update itinerary status</DialogTitle>
            <DialogDescription>
              Update the status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-trip-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-trip-status-${itemKey}`}
                placeholder="COMPLETED"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  const renderDisabledMessageAction = () => (
    <Button size="sm" variant="outline" disabled>
      Open chat
    </Button>
  )
  const renderDisabledReceiptAction = () => (
    <Button size="sm" variant="outline" disabled>
      Upload receipt
    </Button>
  )

  return (
    <DashboardShell
      title="Tourist dashboard"
      subtitle="Track itineraries, compare bids, and keep trips on schedule with verified drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon]

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              trend={stat.trend}
              icon={Icon ? <Icon className="h-5 w-5" /> : null}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard
            {...data.recentItineraries}
            headerAction={renderCreateItineraryAction()}
          />
          <DashboardListCard
            {...data.bidUpdates}
            renderItemActions={renderBidUpdateAction}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-border-subtle bg-bg-base/50 p-3 text-xs text-text-muted">
              Messaging and itinerary creation screens are next in the build queue.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...data.upcomingTrips}
          renderItemActions={renderTripStatusAction}
        />
        <DashboardListCard
          {...data.messages}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              New message
            </Button>
          }
          renderItemActions={renderDisabledMessageAction}
        />
        <DashboardListCard
          {...data.receipts}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              Upload receipt
            </Button>
          }
          renderItemActions={renderDisabledReceiptAction}
        />
      </section>
    </DashboardShell>
  )
}
