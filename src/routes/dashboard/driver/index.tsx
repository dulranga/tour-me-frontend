import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { CheckCircle, ClipboardList, Gauge, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/driver/')({
  component: DriverDashboard,
})

type DriverBid = {
  bidId: number
  itineraryId: number
  bidAmount: number
  status: string
  submittedAt: string
}

type UpcomingTrip = {
  tripId: number
  pickupLocation: string
  destination: string
  pickupTime: string
  status: string
}

type DriverStats = {
  activeBidsCount: number
  tripsThisMonth: number
  earningsThisMonth: number
  ratingCount: number
}

function DriverDashboard() {
  const { user } = useRouteContext({ from: '/dashboard' })

  // Fetch driver stats
  const { data: stats } = useQuery({
    queryKey: ['driver-stats', user.userId],
    queryFn: () =>
      api<DriverStats>(`/drivers/${user.userId}/stats`).catch(() => ({
        activeBidsCount: 0,
        tripsThisMonth: 0,
        earningsThisMonth: 0,
        ratingCount: 0,
      })),
  })

  // Fetch driver's pending bids
  const { data: bids } = useQuery({
    queryKey: ['driver-bids', user.userId],
    queryFn: () => api<DriverBid[]>(`/bids/driver/${user.userId}`),
  })

  // Fetch driver's upcoming trips
  const { data: trips } = useQuery({
    queryKey: ['driver-upcoming-trips', user.userId],
    queryFn: () => api<UpcomingTrip[]>(`/trips/driver/${user.userId}`),
  })

  const iconMap: Record<string, LucideIcon> = {
    clipboard: ClipboardList,
    users: Users,
    gauge: Gauge,
    'check-circle': CheckCircle,
  }

  const statCards = [
    {
      title: 'Active bids',
      value: stats?.activeBidsCount ?? 0,
      description: 'Pending responses',
      icon: 'clipboard',
    },
    {
      title: 'Trips this month',
      value: stats?.tripsThisMonth ?? 0,
      description: 'Completed trips',
      icon: 'users',
    },
    {
      title: 'Earnings',
      value: `LKR ${stats?.earningsThisMonth ?? 0}`,
      description: 'This month',
      icon: 'gauge',
    },
    {
      title: 'Rating',
      value: `${stats?.ratingCount ?? 0}/5`,
      description: 'Average rating',
      icon: 'check-circle',
    },
  ]

  const bidPipeline: DashboardListData = {
    title: 'Bid pipeline',
    description: 'Active bids awaiting response',
    items: [] as DashboardListItem[],
  }

  if (bids) {
    bids
      .filter((b) => b.status === 'PENDING')
      .slice(0, 5)
      .forEach((bid) => {
        bidPipeline.items.push({
          id: bid.bidId.toString(),
          title: `Itinerary #${bid.itineraryId}`,
          subtitle: `LKR ${bid.bidAmount}`,
          meta: new Date(bid.submittedAt).toLocaleDateString(),
          status: 'Pending',
          statusVariant: 'secondary',
        })
      })
  }

  const upcomingTrips: DashboardListData = {
    title: 'Upcoming trips',
    description: 'Your scheduled trips',
    items: [] as DashboardListItem[],
  }

  if (trips) {
    trips.slice(0, 5).forEach((trip) => {
      upcomingTrips.items.push({
        id: trip.tripId.toString(),
        title: `${trip.pickupLocation} → ${trip.destination}`,
        subtitle: trip.status,
        meta: new Date(trip.pickupTime).toLocaleDateString(),
        status: trip.status,
        statusVariant: 'secondary',
      })
    })
  }

  return (
    <DashboardShell
      title="Driver dashboard"
      subtitle="Track itinerary requests, manage bids, and stay ready for upcoming trips."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <>
          <Badge variant="success" className="h-9 px-3">
            Available
          </Badge>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = iconMap[stat.icon] ?? ClipboardList

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={String(stat.value)}
              description={stat.description}
              trend={undefined}
              icon={<Icon className="h-5 w-5" />}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard {...bidPipeline} />
          <DashboardListCard {...upcomingTrips} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Driver focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Keep documents up to date to remain visible in the marketplace.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Respond to bids within 24 hours to improve acceptance rate.
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button className="w-full" variant="outline" disabled>
                Set available
              </Button>
              <Button className="w-full" variant="outline" disabled>
                Set unavailable
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Update driver details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update driver details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="driver-name">Name</Label>
                    <Input id="driver-name" placeholder="Your name" disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="driver-email">Email</Label>
                    <Input
                      id="driver-email"
                      type="email"
                      placeholder="Your email"
                      disabled
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="button" disabled>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
