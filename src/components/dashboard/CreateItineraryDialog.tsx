import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
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
import { api } from '#/lib/api/client'
import {
  fetchRouteEstimate,
  formatDistance,
  formatDuration,
  type RouteEstimate,
} from '#/lib/osrm'
import { isPointInSriLanka } from '#/lib/sriLanka'
import { LocationSearchInput } from './LocationSearchInput'
import { ItineraryMapPicker } from './ItineraryMapPicker'

interface CreateItineraryDialogProps {
  userId: string
}

interface LocationPoint {
  address: string
  lat?: number
  lng?: number
}

export function CreateItineraryDialog({ userId }: CreateItineraryDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [pickup, setPickup] = useState<LocationPoint>({ address: '' })
  const [destination, setDestination] = useState<LocationPoint>({ address: '' })
  const [routeEstimate, setRouteEstimate] = useState<RouteEstimate | null>(null)
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false)
  const [routeError, setRouteError] = useState('')

  const [otherDetails, setOtherDetails] = useState({
    pickupTime: '',
    estimatedDistance: '',
    estimatedDuration: '',
    numberOfPassengers: '1',
    specialRequests: '',
  })

  useEffect(() => {
    const hasPickupCoords =
      typeof pickup.lat === 'number' && typeof pickup.lng === 'number'
    const hasDestinationCoords =
      typeof destination.lat === 'number' && typeof destination.lng === 'number'

    if (!hasPickupCoords || !hasDestinationCoords) {
      setRouteEstimate(null)
      setRouteError('')
      setIsCalculatingRoute(false)
      setOtherDetails((prev) => ({
        ...prev,
        estimatedDistance: '',
        estimatedDuration: '',
      }))
      return
    }

    const controller = new AbortController()
    let isActive = true

    async function calculateRoute() {
      setIsCalculatingRoute(true)
      setRouteError('')

      try {
        const estimate = await fetchRouteEstimate(
          { lat: pickup.lat, lng: pickup.lng },
          { lat: destination.lat, lng: destination.lng },
          controller.signal,
        )

        if (!isActive) return

        setRouteEstimate(estimate)
        setOtherDetails((prev) => ({
          ...prev,
          estimatedDistance: estimate.distanceKm.toFixed(1),
          estimatedDuration: Math.max(
            1,
            Math.round(estimate.durationMinutes),
          ).toString(),
        }))
      } catch (error) {
        if (!isActive || controller.signal.aborted) return

        setRouteEstimate(null)
        setRouteError(
          error instanceof Error
            ? error.message
            : 'Unable to calculate route estimate',
        )
      } finally {
        if (isActive) {
          setIsCalculatingRoute(false)
        }
      }
    }

    void calculateRoute()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [destination.lat, destination.lng, pickup.lat, pickup.lng])

  const createItineraryMutation = useMutation({
    mutationFn: (values: any) =>
      api(`/itineraries?touristId=${userId}`, {
        method: 'POST',
        body: {
          // Storing as "Address | lat,lng" to maintain compatibility while preserving coordinates
          pickupLocation: values.pickup.lat
            ? `${values.pickup.address} | ${values.pickup.lat},${values.pickup.lng}`
            : values.pickup.address,
          destination: values.destination.lat
            ? `${values.destination.address} | ${values.destination.lat},${values.destination.lng}`
            : values.destination.address,
          pickupTime: values.details.pickupTime,
          estimatedDistance: parseFloat(values.details.estimatedDistance) || 0,
          estimatedDuration: parseInt(values.details.estimatedDuration) || 1,
          numberOfPassengers: parseInt(values.details.numberOfPassengers),
          specialRequirements: values.details.specialRequests,
        },
      }),
    onSuccess: () => {
      toast.success('Itinerary created successfully')
      setOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['user-itineraries', userId] })
    },
    onError: () => {
      toast.error('Failed to create itinerary')
    },
  })

  const resetForm = () => {
    setPickup({ address: '' })
    setDestination({ address: '' })
    setOtherDetails({
      pickupTime: '',
      estimatedDistance: '',
      estimatedDuration: '',
      numberOfPassengers: '1',
      specialRequests: '',
    })
  }

  const handlePointSelect = (
    type: 'pickup' | 'destination',
    lat: number,
    lng: number,
  ) => {
    if (!isPointInSriLanka({ lat, lng })) {
      return
    }

    // Reverse geocoding could be added here, but for now we'll use "Map Selected Location"
    // and let the user refine it via search if they want a specific address.
    const point = {
      address: `Selected via Map (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat,
      lng,
    }
    if (type === 'pickup') setPickup(point)
    else setDestination(point)
  }
  const today = new Date().toISOString().slice(0, 16)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create itinerary</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create itinerary</DialogTitle>
          <DialogDescription>
            Plan your trip by selecting locations on the map or searching for
            addresses.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 lg:grid-cols-2">
          <div className="space-y-4">
            <LocationSearchInput
              label="Pickup location"
              placeholder="Search for pickup point..."
              value={pickup.address}
              onChange={(address, lat, lng) => setPickup({ address, lat, lng })}
            />
            <LocationSearchInput
              label="Destination"
              placeholder="Search for destination..."
              value={destination.address}
              onChange={(address, lat, lng) =>
                setDestination({ address, lat, lng })
              }
            />

            <div className="grid gap-2">
              <Label htmlFor="pickup-time">Pickup time</Label>
              <Input
                id="pickup-time"
                type="datetime-local"
                min={today}
                value={otherDetails.pickupTime}
                onChange={(e) =>
                  setOtherDetails((prev) => ({
                    ...prev,
                    pickupTime: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="passengers">Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  value={otherDetails.numberOfPassengers}
                  onChange={(e) =>
                    setOtherDetails((prev) => ({
                      ...prev,
                      numberOfPassengers: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Days</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={otherDetails.estimatedDuration}
                  onChange={(e) =>
                    setOtherDetails((prev) => ({
                      ...prev,
                      estimatedDuration: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="requests">Special requests</Label>
              <Input
                id="requests"
                placeholder="Notes for the driver..."
                value={otherDetails.specialRequests}
                onChange={(e) =>
                  setOtherDetails((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Map View</Label>
            <ItineraryMapPicker
              pickup={
                pickup.lat ? { lat: pickup.lat, lng: pickup.lng! } : undefined
              }
              destination={
                destination.lat
                  ? { lat: destination.lat, lng: destination.lng! }
                  : undefined
              }
              onPointSelect={handlePointSelect}
            />
            <div className="rounded-md border border-border-subtle bg-bg-base/50 p-3 text-xs text-text-secondary">
              {isCalculatingRoute ? (
                'Calculating route estimate from the selected locations...'
              ) : routeEstimate ? (
                <div className="grid gap-1">
                  <span>
                    Estimated distance:{' '}
                    {formatDistance(routeEstimate.distanceKm)}
                  </span>
                  <span>
                    Estimated duration:{' '}
                    {formatDuration(routeEstimate.durationMinutes)}
                  </span>
                </div>
              ) : routeError ? (
                <span>{routeError}</span>
              ) : (
                'Select both pickup and destination to calculate the route estimate.'
              )}
            </div>
            <p className="text-[10px] text-text-muted">
              Tip: Finding a specific place? Use the search box. Want to
              fine-tune? Drag the markers.
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={
              createItineraryMutation.isPending ||
              !pickup.address ||
              !destination.address
            }
            onClick={() =>
              createItineraryMutation.mutate({
                pickup,
                destination,
                details: otherDetails,
              })
            }
          >
            {createItineraryMutation.isPending
              ? 'Creating...'
              : 'Create itinerary'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
