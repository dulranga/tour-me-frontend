import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/dashboard/tourist/itineraries')({
  component: TouristItinerariesPage,
})

type Itinerary = {
  itineraryId: number
  touristId: number
  pickupLocation: string
  destination: string
  pickupTime: string
  estimatedDuration: number
  maxBudget: number
  numberOfPassengers: number
  specialRequirements?: string
  status: 'DRAFT' | 'OPEN' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
}

function TouristItinerariesPage() {
  const { user } = useRouteContext({ from: '/dashboard' })
  const queryClient = useQueryClient()

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null,
  )
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Form states for create
  const [createForm, setCreateForm] = useState({
    pickupLocation: '',
    destination: '',
    pickupTime: '',
    estimatedDuration: '',
    maxBudget: '',
    numberOfPassengers: '',
    specialRequirements: '',
  })

  // Fetch user's itineraries
  const {
    data: itineraries,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-itineraries', user.userId],
    queryFn: () => api<Itinerary[]>(`/itineraries/user/${user.userId}`),
  })

  // Create itinerary mutation
  const createMutation = useMutation({
    mutationFn: () =>
      api('/itineraries', {
        method: 'POST',
        body: {
          pickupLocation: createForm.pickupLocation,
          destination: createForm.destination,
          pickupTime: createForm.pickupTime,
          estimatedDuration: parseInt(createForm.estimatedDuration),
          maxBudget: parseFloat(createForm.maxBudget),
          numberOfPassengers: parseInt(createForm.numberOfPassengers),
          specialRequirements: createForm.specialRequirements,
        },
      }),
    onSuccess: () => {
      toast.success('Itinerary created successfully')
      setIsCreateDialogOpen(false)
      setCreateForm({
        pickupLocation: '',
        destination: '',
        pickupTime: '',
        estimatedDuration: '',
        maxBudget: '',
        numberOfPassengers: '',
        specialRequirements: '',
      })
      void queryClient.invalidateQueries({
        queryKey: ['user-itineraries', user.userId],
      })
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create itinerary',
      )
    },
  })

  // Cancel itinerary mutation
  const cancelMutation = useMutation({
    mutationFn: (itineraryId: number) =>
      api(`/itineraries/${itineraryId}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Itinerary cancelled successfully')
      setIsCancelDialogOpen(false)
      setSelectedItinerary(null)
      void queryClient.invalidateQueries({
        queryKey: ['user-itineraries', user.userId],
      })
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : 'Failed to cancel itinerary',
      )
    },
  })

  const handleCreateItinerary = () => {
    if (!createForm.pickupLocation.trim() || !createForm.destination.trim()) {
      toast.error('Pickup location and destination are required')
      return
    }
    createMutation.mutate()
  }

  // Group itineraries by status
  const groupedItineraries = {
    drafts: {
      title: 'Drafts',
      description: 'Trips that are still being planned.',
      items: [] as DashboardListItem[],
    },
    openForBids: {
      title: 'Open for bids',
      description: 'Itineraries waiting on driver offers.',
      items: [] as DashboardListItem[],
    },
    confirmed: {
      title: 'Confirmed',
      description: 'Trips matched with drivers.',
      items: [] as DashboardListItem[],
    },
  }

  if (itineraries) {
    itineraries.forEach((it) => {
      const item: DashboardListItem = {
        id: it.itineraryId.toString(),
        title: `${it.pickupLocation} → ${it.destination}`,
        subtitle: `${it.numberOfPassengers} passenger${it.numberOfPassengers > 1 ? 's' : ''}`,
        meta: new Date(it.pickupTime).toLocaleDateString(),
        status: it.status,
        statusVariant:
          it.status === 'OPEN'
            ? 'secondary'
            : it.status === 'CONFIRMED'
              ? 'success'
              : 'outline',
      }

      if (it.status === 'DRAFT') {
        groupedItineraries.drafts.items.push(item)
      } else if (it.status === 'OPEN') {
        groupedItineraries.openForBids.items.push(item)
      } else if (it.status === 'CONFIRMED') {
        groupedItineraries.confirmed.items.push(item)
      }
    })
  }

  const renderCreateItineraryAction = () => (
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create itinerary</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create itinerary</DialogTitle>
          <DialogDescription>
            Add pickup and destination details for a new trip.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 max-h-[60vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-pickup">
              Pickup location
            </Label>
            <Input
              id="tourist-itinerary-create-pickup"
              placeholder="Colombo Fort"
              value={createForm.pickupLocation}
              onChange={(e) =>
                setCreateForm({ ...createForm, pickupLocation: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-destination">
              Destination
            </Label>
            <Input
              id="tourist-itinerary-create-destination"
              placeholder="Kandy"
              value={createForm.destination}
              onChange={(e) =>
                setCreateForm({ ...createForm, destination: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-datetime">
              Pickup time
            </Label>
            <Input
              id="tourist-itinerary-create-datetime"
              type="datetime-local"
              value={createForm.pickupTime}
              onChange={(e) =>
                setCreateForm({ ...createForm, pickupTime: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-duration">
              Estimated duration (minutes)
            </Label>
            <Input
              id="tourist-itinerary-create-duration"
              type="number"
              placeholder="120"
              value={createForm.estimatedDuration}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  estimatedDuration: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-budget">
              Max budget (LKR)
            </Label>
            <Input
              id="tourist-itinerary-create-budget"
              type="number"
              placeholder="5000"
              value={createForm.maxBudget}
              onChange={(e) =>
                setCreateForm({ ...createForm, maxBudget: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-passengers">
              Number of passengers
            </Label>
            <Input
              id="tourist-itinerary-create-passengers"
              type="number"
              placeholder="1"
              value={createForm.numberOfPassengers}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  numberOfPassengers: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tourist-itinerary-create-requirements">
              Special requirements
            </Label>
            <Input
              id="tourist-itinerary-create-requirements"
              placeholder="Wheelchair accessible, etc."
              value={createForm.specialRequirements}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  specialRequirements: e.target.value,
                })
              }
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
            onClick={handleCreateItinerary}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create itinerary'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const renderCancelAction = (item: DashboardListItem) => {
    const itinerary = itineraries?.find(
      (it) => it.itineraryId.toString() === item.id,
    )
    if (!itinerary || itinerary.status === 'CANCELLED') return null

    return (
      <Dialog
        open={
          isCancelDialogOpen &&
          selectedItinerary?.itineraryId === itinerary.itineraryId
        }
        onOpenChange={(open) => {
          if (!open) {
            setIsCancelDialogOpen(false)
            setSelectedItinerary(null)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedItinerary(itinerary)
              setIsCancelDialogOpen(true)
            }}
          >
            Cancel itinerary
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel itinerary</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this itinerary? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                No, keep it
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => cancelMutation.mutate(itinerary.itineraryId)}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? 'Cancelling...' : 'Yes, cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Itineraries"
      subtitle="Manage draft plans, open bids, and confirmed itineraries."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading itineraries...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error
            ? error.message
            : 'Failed to load itineraries'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-3">
          <DashboardListCard
            {...groupedItineraries.drafts}
            headerAction={renderCreateItineraryAction()}
            renderItemActions={renderCancelAction}
          />
          <DashboardListCard
            {...groupedItineraries.openForBids}
            renderItemActions={renderCancelAction}
          />
          <DashboardListCard {...groupedItineraries.confirmed} />
        </section>
      )}
    </DashboardShell>
  )
}
