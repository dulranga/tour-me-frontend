import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

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
import { api } from '#/lib/api/client'
import type { DashboardListItem } from '#/lib/api/dashboard'
import { RouteViewer } from './RouteViewer'

interface SubmitBidDialogProps {
  item: DashboardListItem
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function SubmitBidDialog({
  item,
  trigger,
  onSuccess,
}: SubmitBidDialogProps) {
  console.log(item)

  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState('')

  const submitBidMutation = useMutation({
    mutationFn: (variables: { itineraryId: number; bidAmount: number }) =>
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
      onSuccess?.()
      void queryClient.invalidateQueries({ queryKey: ['driver-marketplace'] })
      void queryClient.invalidateQueries({
        queryKey: ['available-itineraries'],
      })
      void queryClient.invalidateQueries({ queryKey: ['driver-bids'] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to submit bid')
    },
  })

  const handleSubmitBid = () => {
    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid bid amount')
      return
    }

    submitBidMutation.mutate({
      itineraryId: Number(item.id),
      bidAmount: amount,
    })
  }

  // Parse location coordinates from the title/subtitle if available (format: "Address | lat,lng")
  // Note: the DashboardListItem in marketplace might vary, so we need cautious parsing
  const extractCoords = (str?: string) => {
    if (!str || !str.includes(' | ')) return null
    const parts = str.split(' | ')
    const coordParts = parts[parts.length - 1].split(',')
    if (coordParts.length !== 2) return null
    return {
      lat: parseFloat(coordParts[0]),
      lng: parseFloat(coordParts[1]),
    }
  }

  // Assuming item.title and item.subtitle contain the full location strings from marketplace
  // However, we now prefer rawTitle and rawSubtitle if provided by the marketplace
  const pickup = extractCoords(item.rawTitle || item.title)
  const destination = extractCoords(item.rawSubtitle || item.subtitle)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">Submit bid</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit bid</DialogTitle>
          <DialogDescription>
            Provide a bid amount for{' '}
            {item.title?.split(' | ')[1]
              ? item.title.split(' | ')[0]
              : item.title}
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {pickup && destination && (
            <div className="space-y-2">
              <Label>Route Preview</Label>
              <RouteViewer pickup={pickup} destination={destination} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="bid-amount">Bid amount (LKR)</Label>
            <Input
              id="bid-amount"
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
