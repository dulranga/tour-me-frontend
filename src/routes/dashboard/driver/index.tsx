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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Set available
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set availability</DialogTitle>
                <DialogDescription>
                  Mark your account as available for new bids.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="driver-available-id">Driver ID</Label>
                  <Input id="driver-available-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driver-available-status">Status</Label>
                  <Input id="driver-available-status" value="Active" readOnly />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button">Set available</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Set unavailable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set unavailable</DialogTitle>
                <DialogDescription>
                  Pause new bids while you are off duty.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="driver-unavailable-id">Driver ID</Label>
                  <Input id="driver-unavailable-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driver-unavailable-status">Status</Label>
                  <Input
                    id="driver-unavailable-status"
                    value="Inactive"
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
                <Button type="button">Set unavailable</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Update documents</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update verification documents</DialogTitle>
                  <DialogDescription>
                    Upload the latest license and registration files.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="driver-license-file">Driver license</Label>
                    <Input id="driver-license-file" type="file" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="driver-registration-file">
                      Vehicle registration
                    </Label>
                    <Input id="driver-registration-file" type="file" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="driver-doc-notes">Notes</Label>
                    <Input
                      id="driver-doc-notes"
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
                  <Button type="button">Upload documents</Button>
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
