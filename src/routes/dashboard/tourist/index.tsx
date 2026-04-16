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

  return (
    <DashboardShell
      title="Tourist dashboard"
      subtitle="Track itineraries, compare bids, and keep trips on schedule with verified drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">New itinerary</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create itinerary</DialogTitle>
                <DialogDescription>
                  Start a new draft itinerary for bidding.
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
                <div className="grid gap-2">
                  <Label htmlFor="tourist-itinerary-start">Start date</Label>
                  <Input id="tourist-itinerary-start" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tourist-itinerary-end">End date</Label>
                  <Input id="tourist-itinerary-end" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tourist-itinerary-stays">Overnight stays</Label>
                  <Input
                    id="tourist-itinerary-stays"
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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Upload receipt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload receipt</DialogTitle>
                <DialogDescription>
                  Submit travel expense receipts for review.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tourist-receipt-amount">Amount</Label>
                  <Input
                    id="tourist-receipt-amount"
                    type="number"
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tourist-receipt-file">Receipt file</Label>
                  <Input id="tourist-receipt-file" type="file" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tourist-receipt-notes">Notes</Label>
                  <Input
                    id="tourist-receipt-notes"
                    placeholder="Add optional notes"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button">Upload receipt</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      }
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
          <DashboardListCard {...data.recentItineraries} />
          <DashboardListCard {...data.bidUpdates} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Start new itinerary</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start new itinerary</DialogTitle>
                  <DialogDescription>
                    Draft a trip plan before requesting bids.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-quick-pickup">Pickup location</Label>
                    <Input
                      id="tourist-quick-pickup"
                      placeholder="Colombo Fort"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-quick-destination">Destination</Label>
                    <Input
                      id="tourist-quick-destination"
                      placeholder="Kandy"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-quick-start">Start date</Label>
                    <Input id="tourist-quick-start" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-quick-end">End date</Label>
                    <Input id="tourist-quick-end" type="date" />
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Review pending bids
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pending bids</DialogTitle>
                  <DialogDescription>
                    Compare bid amounts and statuses.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-bid-id">Bid ID</Label>
                    <Input id="tourist-bid-id" placeholder="BID-2040" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-bid-status">Status</Label>
                    <Input id="tourist-bid-status" placeholder="Pending" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="button">Refresh bids</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Message a driver
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Message a driver</DialogTitle>
                  <DialogDescription>
                    Send a question before confirming a bid.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-message-driver">Driver ID</Label>
                    <Input
                      id="tourist-message-driver"
                      placeholder="DRV-1001"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-message-body">Message</Label>
                    <Input
                      id="tourist-message-body"
                      placeholder="Write your message"
                      className="h-24"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button">Send message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="rounded-md border border-border-subtle bg-bg-base/50 p-3 text-xs text-text-muted">
              Messaging and itinerary creation screens are next in the build queue.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.upcomingTrips} />
        <DashboardListCard {...data.messages} />
        <DashboardListCard {...data.receipts} />
      </section>
    </DashboardShell>
  )
}
