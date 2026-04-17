import { useState } from 'react'
import {
  useQueries,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { toast } from 'sonner'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/bids')({
  component: TouristBidsPage,
})

type UserItinerary = {
  itineraryId: number
  touristId: number
  pickupLocation: string
  destination: string
  pickupTime: string
  estimatedDuration: number
  maxBudget: number
  numberOfPassengers: number
  status: string
  createdAt: string
}

type BidForItinerary = {
  bidId: number
  driverId: number
  itineraryId: number
  bidAmount: number
  estimatedArrivalTime: string
  notes: string
  vehicleDetails: string
  status: 'PENDING' | 'SELECTED' | 'DECLINED'
  submittedAt: string
  driverName?: string
}

function TouristBidsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })
  const queryClient = useQueryClient()
  const [selectedBid, setSelectedBid] = useState<BidForItinerary | null>(null)
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false)

  // Fetch user's itineraries
  const { data: itineraries, isLoading: itinerariesLoading } = useQuery({
    queryKey: ['user-itineraries', user.userId],
    queryFn: () => api<UserItinerary[]>(`/itineraries/user/${user.userId}`),
  })

  // Fetch bids for each itinerary in parallel
  const bidQueries = useQueries({
    queries: (itineraries ?? []).map((itinerary) => ({
      queryKey: ['itinerary-bids', itinerary.itineraryId],
      queryFn: () =>
        api<BidForItinerary[]>(`/bids/itinerary/${itinerary.itineraryId}`),
    })),
  })

  // Mutation for accepting a bid
  const acceptBidMutation = useMutation({
    mutationFn: (bidId: number) =>
      api(`/bids/${bidId}/select`, {
        method: 'POST',
        body: {
          touristId: user.userId,
        },
      }),
    onSuccess: () => {
      toast.success('Bid accepted successfully')
      setIsAcceptDialogOpen(false)
      setSelectedBid(null)
      void queryClient.invalidateQueries({
        queryKey: ['user-itineraries', user.userId],
      })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to accept bid')
    },
  })

  // Combine all bids from all queries
  const allBids: BidForItinerary[] = bidQueries.flatMap(
    (query) => query.data ?? [],
  )

  // Group bids by status
  const groupedBids = {
    newBids: {
      title: 'New bids',
      description: 'Latest driver offers.',
      items: [] as DashboardListItem[],
    },
    expiringSoon: {
      title: 'Expiring soon',
      description: 'Offers that need a response.',
      items: [] as DashboardListItem[],
    },
    accepted: {
      title: 'Accepted bids',
      description: 'Drivers selected for your trips.',
      items: [] as DashboardListItem[],
    },
  }

  allBids.forEach((bid) => {
    const item: DashboardListItem = {
      id: bid.bidId.toString(),
      title: `Driver - LKR ${bid.bidAmount}`,
      subtitle: bid.notes || 'No notes provided',
      meta: `Itinerary #${bid.itineraryId}`,
      status: bid.status,
      statusVariant:
        bid.status === 'SELECTED'
          ? 'success'
          : bid.status === 'PENDING'
            ? 'secondary'
            : 'destructive',
    }

    if (bid.status === 'SELECTED') {
      groupedBids.accepted.items.push(item)
    } else {
      // Group PENDING as new or expiring
      groupedBids.newBids.items.push(item)
    }
  })

  const renderAcceptBidAction = (item: DashboardListItem) => {
    const bid = allBids.find((b) => b.bidId.toString() === item.id)
    if (!bid || bid.status === 'SELECTED') return null

    return (
      <Dialog
        open={isAcceptDialogOpen && selectedBid?.bidId === bid.bidId}
        onOpenChange={(open) => {
          if (!open) {
            setIsAcceptDialogOpen(false)
            setSelectedBid(null)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            onClick={() => {
              setSelectedBid(bid)
              setIsAcceptDialogOpen(true)
            }}
          >
            Accept bid
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept bid</DialogTitle>
            <DialogDescription>
              Accept this bid for itinerary #{bid.itineraryId}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Bid amount</span>
              <span className="font-semibold">LKR {bid.bidAmount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Arrival time</span>
              <span className="text-sm">{bid.estimatedArrivalTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Vehicle</span>
              <span className="text-sm">{bid.vehicleDetails}</span>
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
              onClick={() => acceptBidMutation.mutate(bid.bidId)}
              disabled={acceptBidMutation.isPending}
            >
              {acceptBidMutation.isPending ? 'Accepting...' : 'Accept bid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const isLoading = itinerariesLoading || bidQueries.some((q) => q.isLoading)
  const isError = bidQueries.some((q) => q.isError)

  return (
    <DashboardShell
      title="Bids"
      subtitle="Compare offers from verified drivers before you decide."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      {isLoading && <p className="text-sm text-text-muted">Loading bids...</p>}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          Failed to load bids
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-3">
          <DashboardListCard
            {...groupedBids.newBids}
            renderItemActions={renderAcceptBidAction}
          />
          <DashboardListCard
            {...groupedBids.expiringSoon}
            renderItemActions={renderAcceptBidAction}
          />
          <DashboardListCard {...groupedBids.accepted} />
        </section>
      )}
    </DashboardShell>
  )
}
