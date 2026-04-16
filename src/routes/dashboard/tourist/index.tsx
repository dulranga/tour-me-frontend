import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Handshake, MapPin, Receipt } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristOverviewData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

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
          <Button size="sm" disabled>
            New itinerary
          </Button>
          <Button size="sm" variant="outline" disabled>
            Upload receipt
          </Button>
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
            <Button className="w-full" disabled>
              Start new itinerary
            </Button>
            <Button className="w-full" variant="outline" disabled>
              Review pending bids
            </Button>
            <Button className="w-full" variant="outline" disabled>
              Message a driver
            </Button>
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
