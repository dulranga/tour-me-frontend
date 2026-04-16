import { createFileRoute } from '@tanstack/react-router'
import { CheckCircle, ClipboardList, Gauge, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverOverviewData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
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

export const Route = createFileRoute('/dashboard/driver/')({
  component: DriverDashboard,
})

function DriverDashboard() {
  const data = getDriverOverviewData()
  const iconMap: Record<string, LucideIcon> = {
    clipboard: ClipboardList,
    users: Users,
    gauge: Gauge,
    'check-circle': CheckCircle,
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
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? ClipboardList

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              trend={stat.trend}
              icon={<Icon className="h-5 w-5" />}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard {...data.bidPipeline} />
          <DashboardListCard {...data.upcomingTrips} />
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
                  <DialogDescription>
                    Update your license number and vehicle details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="driver-license-number">
                      License number
                    </Label>
                    <Input
                      id="driver-license-number"
                      placeholder="LIC-000123"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="driver-vehicle-details">
                      Vehicle details
                    </Label>
                    <Input
                      id="driver-vehicle-details"
                      placeholder="Toyota Prius, 4 seats"
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
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.messages} />
        <DashboardListCard {...data.marketplaceHighlights} />
        <DashboardListCard {...data.verificationStatus} />
      </section>
    </DashboardShell>
  )
}
