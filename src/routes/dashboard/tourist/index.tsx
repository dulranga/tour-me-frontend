import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'
import { Calendar, Handshake, MapPin, Receipt } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { touristNavItems } from '#/components/dashboard/navigation'
import { CreateItineraryDialog } from '#/components/dashboard/CreateItineraryDialog'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { api } from '#/lib/api/client'

export const Route = createFileRoute('/dashboard/tourist/')({
  component: TouristDashboard,
})

function TouristDashboard() {
  const context = useRouteContext({ from: '/dashboard' })
  const user = context.user
  console.log(context)

  const queryClient = useQueryClient()

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
    })

  // Fetch user bids
  const { data: bidsResponse, isLoading: isLoadingBids } = useQuery({
    queryKey: ['user-bids', user.userId],
    queryFn: () => api<any[]>(`/bids/my-bids`),
  })

  const bidsData = bidsResponse ?? []

  // Calculate stats from real data
  const stats = [
    {
      title: 'Active itineraries',
      value: String(
        Array.isArray(itinerariesResponse)
          ? itinerariesResponse.filter((i: any) => i.status === 'OPEN').length
          : 0,
      ),
      description: 'Awaiting driver selection',
      icon: 'map-pin' as const,
    },
    {
      title: 'Open bids',
      value: String(bidsData.filter((b: any) => b.status === 'PENDING').length),
      description: 'Awaiting your response',
      icon: 'handshake' as const,
    },
    {
      title: 'Accepted trips',
      value: String(
        bidsData.filter((b: any) => b.status === 'ACCEPTED').length,
      ),
      description: 'Driver confirmed',
      icon: 'calendar' as const,
    },
    {
      title: 'Pending receipts',
      value: '0',
      description: 'All caught up',
      icon: 'receipt' as const,
    },
  ]

  const renderBidUpdateAction = (item: any) => {
    if (item.status === 'ACCEPTED') {
      return (
        <Badge variant="success" className="h-9 px-3">
          Confirmed
        </Badge>
      )
    }

    if (item.status !== 'PENDING') return null

    return (
      <Button
        size="sm"
        onClick={() => selectBidMutation.mutate(item.id)}
        disabled={selectBidMutation.isPending}
      >
        {selectBidMutation.isPending ? 'Accepting...' : 'Accept bid'}
      </Button>
    )
  }
  const renderTripStatusAction = () => (
    <Button size="sm" variant="outline" disabled>
      View details
    </Button>
  )

  // Select bid mutation
  const selectBidMutation = useMutation({
    mutationFn: (bidId: string) =>
      api(`/bids/${bidId}/select?touristId=${user.userId}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      toast.success('Bid accepted successfully')
      void queryClient.invalidateQueries({
        queryKey: ['user-itineraries', user.userId],
      })
      void queryClient.invalidateQueries({
        queryKey: ['user-bids', user.userId],
      })
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to accept bid')
    },
  })

  return (
    <DashboardShell
      title="Tourist dashboard"
      subtitle="Track itineraries, compare bids, and keep trips on schedule with verified drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.icon]

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={<Icon className="h-5 w-5" />}
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
                    title:
                      itinerary.pickupLocation?.split(' | ')[0] ||
                      itinerary.pickupLocation,
                    subtitle: `To: ${itinerary.destination?.split(' | ')[0] || itinerary.destination}`,
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
            headerAction={<CreateItineraryDialog userId={user.userId} />}
          />
          <DashboardListCard
            title="Received bids"
            description="Drivers bidding on your itineraries."
            items={bidsData.map((bid: any) => ({
              id: bid.bidId?.toString(),
              title: `LKR ${bid.amount}`,
              subtitle: `Driver: ${bid.driver?.name} (${bid.driver?.vehicleDetails})`,
              meta: bid.status,
              status: bid.status,
              statusVariant:
                bid.status === 'PENDING'
                  ? 'warning'
                  : bid.status === 'ACCEPTED'
                    ? 'success'
                    : 'secondary',
            }))}
            emptyState={isLoadingBids ? 'Loading bids...' : 'No bids yet'}
            renderItemActions={renderBidUpdateAction}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-border-subtle bg-bg-base/50 p-3 text-xs text-text-muted">
              Messages and receipt uploads are coming soon.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          title="Upcoming trips"
          description="Your confirmed and scheduled trips."
          items={
            Array.isArray(itinerariesResponse)
              ? itinerariesResponse
                  .filter((it: any) => it.status === 'CONFIRMED')
                  .map((itinerary: any) => ({
                    id: itinerary.itineraryId?.toString(),
                    title: `${itinerary.pickupLocation} to ${itinerary.destination}`,
                    subtitle: `${itinerary.numberOfPassengers || 1} passenger(s)`,
                    meta: new Date(itinerary.pickupTime).toLocaleDateString(),
                    status: 'CONFIRMED',
                    statusVariant: 'success' as const,
                  }))
              : []
          }
          emptyState="No upcoming trips"
          renderItemActions={renderTripStatusAction}
        />
        <DashboardListCard
          title="Messages"
          description="Communicate with drivers."
          items={[]}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              New message
            </Button>
          }
          renderItemActions={() => (
            <Button size="sm" variant="outline" disabled>
              Open chat
            </Button>
          )}
        />
        <DashboardListCard
          title="Receipts"
          description="Trip expense receipts."
          items={[]}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              Upload receipt
            </Button>
          }
          renderItemActions={() => (
            <Button size="sm" variant="outline" disabled>
              Upload
            </Button>
          )}
        />
      </section>
    </DashboardShell>
  )
}
