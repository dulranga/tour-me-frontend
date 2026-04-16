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

  return (
    <DashboardShell
      title="Bids"
      subtitle="Compare offers from verified drivers before you decide."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Compare bids</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compare bids</DialogTitle>
              <DialogDescription>
                Review bid pricing and driver details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tourist-compare-bid-id">Bid ID</Label>
                <Input id="tourist-compare-bid-id" placeholder="BID-2040" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-compare-amount">Amount</Label>
                <Input
                  id="tourist-compare-amount"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-compare-driver">Driver ID</Label>
                <Input id="tourist-compare-driver" placeholder="DRV-1001" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-compare-vehicle">Vehicle details</Label>
                <Input
                  id="tourist-compare-vehicle"
                  placeholder="Toyota Hiace"
                />
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
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.newBids} />
        <DashboardListCard {...data.expiringSoon} />
        <DashboardListCard {...data.accepted} />
      </section>
    </DashboardShell>
  )
}
