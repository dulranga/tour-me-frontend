import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
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

type DriverMarketplaceResponse = ReturnType<typeof getDriverMarketplaceData>

function DriverMarketplacePage() {
  const {
    data: marketplaceData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-marketplace'],
    queryFn: () => api<DriverMarketplaceResponse>('/itineraries/available'),
    initialData: getDriverMarketplaceData(),
  })
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
      {isFetching ? (
        <p className="text-sm text-text-muted">Loading marketplace...</p>
      ) : null}
      {isError ? (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error
            ? error.message
            : 'Unable to load marketplace.'}
        </p>
      ) : null}
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...marketplaceData.matches}
          renderItemActions={renderSubmitBidAction}
        />
        <DashboardListCard
          {...marketplaceData.expiringSoon}
          renderItemActions={renderSubmitBidAction}
        />
        <DashboardListCard
          {...marketplaceData.newest}
          renderItemActions={renderSubmitBidAction}
        />
      </section>
    </DashboardShell>
  )
}
