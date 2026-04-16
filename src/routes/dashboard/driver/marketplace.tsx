import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

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
type MarketplaceItem = {
  id?: string
  title: string
  subtitle?: string
  meta?: string
  status?: string
  statusVariant?: string
}

function DriverMarketplacePage() {
  const queryClient = useQueryClient()
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState('')

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

  const submitBidMutation = useMutation({
    mutationFn: (variables: { itineraryId: string; bidAmount: number }) =>
      api('/bids', {
        method: 'POST',
        body: {
          itineraryId: variables.itineraryId,
          bidAmount: variables.bidAmount,
        },
      }),
    onSuccess: () => {
      toast.success('Bid submitted successfully')
      setIsDialogOpen(false)
      setBidAmount('')
      setSelectedItem(null)
      void queryClient.invalidateQueries({ queryKey: ['driver-marketplace'] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to submit bid')
    },
  })

  const handleSubmitBid = () => {
    if (!selectedItem?.id) {
      toast.error('Invalid itinerary selected')
      return
    }

    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount')
      return
    }

    submitBidMutation.mutate({
      itineraryId: selectedItem.id,
      bidAmount: amount,
    })
  }

  const renderSubmitBidAction = (item: MarketplaceItem) => {
    return (
      <Dialog
        open={isDialogOpen && selectedItem?.id === item.id}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false)
            setSelectedItem(null)
            setBidAmount('')
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            onClick={() => {
              setSelectedItem(item)
              setIsDialogOpen(true)
            }}
          >
            Submit bid
          </Button>
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
              <Label htmlFor="marketplace-bid-amount">Bid amount (LKR)</Label>
              <Input
                id="marketplace-bid-amount"
                type="number"
                placeholder="0"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmitBid}
              disabled={submitBidMutation.isPending}
            >
              {submitBidMutation.isPending ? 'Submitting...' : 'Submit bid'}
            </Button>
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
