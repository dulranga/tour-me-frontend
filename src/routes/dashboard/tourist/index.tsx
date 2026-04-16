import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { Calendar, Handshake, MapPin, Receipt } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { touristNavItems } from '#/components/dashboard/navigation'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
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
import { getTouristOverviewData } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/tourist/')({
  component: TouristDashboard,
})

function TouristDashboard() {
  const context = useRouteContext({ from: '/dashboard' })
  const user = context.user
  console.log(context)

  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    pickupLocation: '',
    destination: '',
    pickupTime: '',
    estimatedDistance: '',
    estimatedDuration: '',
    numberOfPassengers: '1',
    specialRequests: '',
  })

  const mockData = getTouristOverviewData()
  const iconMap = {
    'map-pin': MapPin,
    handshake: Handshake,
    calendar: Calendar,
    receipt: Receipt,
  }

  // Fetch user itineraries
  const { data: itinerariesResponse, isLoading: isLoadingItineraries } =
    useQuery({
      queryKey: ['user-itineraries', user.userId],
      queryFn: () => api(`/itineraries/user/${user.userId}`),
      initialData: mockData.recentItineraries.items,
    })

  // Create itinerary mutation
  const createItineraryMutation = useMutation({
    mutationFn: (values: typeof formData) =>
      api(`/itineraries?touristId=${user.userId}`, {
        method: 'POST',
        body: {
          pickupLocation: values.pickupLocation,
          destination: values.destination,
          pickupTime: values.pickupTime,
          estimatedDistance: parseFloat(values.estimatedDistance),
          estimatedDuration: parseInt(values.estimatedDuration),
          numberOfPassengers: parseInt(values.numberOfPassengers),
          specialRequests: values.specialRequests,
        },
      }),
    onSuccess: () => {
      toast.success('Itinerary created successfully')
      setIsDialogOpen(false)
      setFormData({
        pickupLocation: '',
        destination: '',
        pickupTime: '',
        estimatedDistance: '',
        estimatedDuration: '',
        numberOfPassengers: '1',
        specialRequests: '',
      })
      // Refetch itineraries
      void queryClient.invalidateQueries({
        queryKey: ['user-itineraries', user.userId],
      })
    },
    onError: () => {
      toast.error('Failed to create itinerary')
    },
  })

  const renderCreateItineraryAction = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create itinerary</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create itinerary</DialogTitle>
          <DialogDescription>
            Add pickup and destination details for a new trip.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pickup-location">Pickup location</Label>
            <Input
              id="pickup-location"
              placeholder="Colombo Fort"
              value={formData.pickupLocation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pickupLocation: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Kandy"
              value={formData.destination}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  destination: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pickup-time">Pickup time</Label>
            <Input
              id="pickup-time"
              type="datetime-local"
              value={formData.pickupTime}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, pickupTime: e.target.value }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="50.5"
                step="0.1"
                value={formData.estimatedDistance}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedDistance: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="120"
                value={formData.estimatedDuration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    estimatedDuration: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="passengers">Number of passengers</Label>
            <Input
              id="passengers"
              type="number"
              placeholder="1"
              min="1"
              value={formData.numberOfPassengers}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numberOfPassengers: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requests">Special requests</Label>
            <Input
              id="requests"
              placeholder="Window seats preferred"
              value={formData.specialRequests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialRequests: e.target.value,
                }))
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
            disabled={createItineraryMutation.isPending}
            onClick={() => createItineraryMutation.mutate(formData)}
          >
            {createItineraryMutation.isPending
              ? 'Creating...'
              : 'Create itinerary'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  const renderBidUpdateAction = (item: { title: string }) => {
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
            <DialogTitle>Update bid status</DialogTitle>
            <DialogDescription>
              Update the status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-bid-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-bid-status-${itemKey}`}
                placeholder="ACCEPTED"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  const renderTripStatusAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update status
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update itinerary status</DialogTitle>
            <DialogDescription>
              Update the status for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`tourist-trip-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-trip-status-${itemKey}`}
                placeholder="COMPLETED"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  const renderDisabledMessageAction = () => (
    <Button size="sm" variant="outline" disabled>
      Open chat
    </Button>
  )
  const renderDisabledReceiptAction = () => (
    <Button size="sm" variant="outline" disabled>
      Upload receipt
    </Button>
  )

  return (
    <DashboardShell
      title="Tourist dashboard"
      subtitle="Track itineraries, compare bids, and keep trips on schedule with verified drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockData.stats.map((stat) => {
          const Icon = iconMap[stat.icon]

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              trend={stat.trend}
              icon={Icon ? <Icon className="h-5 w-5" /> : null}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard
            title="Recent itineraries"
            description="Trips waiting on bids or confirmations."
            items={
              Array.isArray(itinerariesResponse)
                ? itinerariesResponse.map((itinerary: any) => ({
                    id: itinerary.itineraryId?.toString(),
                    title: `${itinerary.pickupLocation} to ${itinerary.destination}`,
                    meta: `${itinerary.numberOfPassengers || 1} passenger(s)`,
                    status: itinerary.status,
                    statusVariant:
                      itinerary.status === 'PENDING'
                        ? 'warning'
                        : itinerary.status === 'CONFIRMED'
                          ? 'success'
                          : 'secondary',
                  }))
                : []
            }
            emptyState={
              isLoadingItineraries
                ? 'Loading itineraries...'
                : 'No itineraries yet'
            }
            headerAction={renderCreateItineraryAction()}
          />
          <DashboardListCard
            {...mockData.bidUpdates}
            renderItemActions={renderBidUpdateAction}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-border-subtle bg-bg-base/50 p-3 text-xs text-text-muted">
              Messaging and itinerary creation screens are next in the build
              queue.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...mockData.upcomingTrips}
          renderItemActions={renderTripStatusAction}
        />
        <DashboardListCard
          {...mockData.messages}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              New message
            </Button>
          }
          renderItemActions={renderDisabledMessageAction}
        />
        <DashboardListCard
          {...mockData.receipts}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              Upload receipt
            </Button>
          }
          renderItemActions={renderDisabledReceiptAction}
        />
      </section>
    </DashboardShell>
  )
}
