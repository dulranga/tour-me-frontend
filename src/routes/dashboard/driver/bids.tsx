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
  const renderUpdateBidAction = (item: { title: string }) => {
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
            <DialogTitle>Update bid</DialogTitle>
            <DialogDescription>
              Adjust amount or status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`driver-bid-amount-${itemKey}`}>
                Bid amount
              </Label>
              <Input
                id={`driver-bid-amount-${itemKey}`}
                type="number"
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`driver-bid-status-${itemKey}`}>Status</Label>
              <Input
                id={`driver-bid-status-${itemKey}`}
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
      title="Bids"
      subtitle="Track pending, accepted, and declined bids."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...data.pending}
          renderItemActions={renderUpdateBidAction}
        />
        <DashboardListCard
          {...data.accepted}
          renderItemActions={renderUpdateBidAction}
        />
        <DashboardListCard
          {...data.declined}
          renderItemActions={renderUpdateBidAction}
        />
      </section>
    </DashboardShell>
  )
}
