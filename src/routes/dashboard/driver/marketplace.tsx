import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverMarketplaceData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/marketplace')({
  component: DriverMarketplacePage,
})

function DriverMarketplacePage() {
  const data = getDriverMarketplaceData()
  const renderSubmitBidAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Submit bid</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit bid</DialogTitle>
            <DialogDescription>
              Provide a bid amount for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`marketplace-bid-amount-${itemKey}`}>
                Bid amount
              </Label>
              <Input
                id={`marketplace-bid-amount-${itemKey}`}
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
            <Button type="button">Submit bid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Marketplace"
      subtitle="Browse itineraries that match your routes and availability."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...data.matches}
          renderItemActions={renderSubmitBidAction}
        />
        <DashboardListCard
          {...data.expiringSoon}
          renderItemActions={renderSubmitBidAction}
        />
        <DashboardListCard
          {...data.newest}
          renderItemActions={renderSubmitBidAction}
        />
      </section>
    </DashboardShell>
  )
}
