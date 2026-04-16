import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverBidsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/bids')({
  component: DriverBidsPage,
})

function DriverBidsPage() {
  const data = getDriverBidsData()

  return (
    <DashboardShell
      title="Bids"
      subtitle="Track pending, accepted, and declined bids."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Update bids
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Refresh bid status</DialogTitle>
              <DialogDescription>
                Filter or refresh your bid pipeline.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver-bid-id">Bid ID</Label>
                <Input id="driver-bid-id" placeholder="BID-1024" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-bid-status">Status filter</Label>
                <Input id="driver-bid-status" placeholder="Pending" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </DialogClose>
              <Button type="button">Refresh</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.pending} />
        <DashboardListCard {...data.accepted} />
        <DashboardListCard {...data.declined} />
      </section>
    </DashboardShell>
  )
}
