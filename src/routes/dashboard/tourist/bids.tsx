import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristBidsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/bids')({
  component: TouristBidsPage,
})

function TouristBidsPage() {
  const data = getTouristBidsData()
  const renderBidAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Compare bid</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compare bid</DialogTitle>
            <DialogDescription>
              Review amount and status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-bid-amount-${itemKey}`}>Amount</Label>
              <Input
                id={`tourist-bid-amount-${itemKey}`}
                type="number"
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`tourist-bid-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-bid-status-${itemKey}`}
                placeholder="PENDING"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Bids"
      subtitle="Compare offers from verified drivers before you decide."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...data.newBids}
          renderItemActions={renderBidAction}
        />
        <DashboardListCard
          {...data.expiringSoon}
          renderItemActions={renderBidAction}
        />
        <DashboardListCard
          {...data.accepted}
          renderItemActions={renderBidAction}
        />
      </section>
    </DashboardShell>
  )
}
