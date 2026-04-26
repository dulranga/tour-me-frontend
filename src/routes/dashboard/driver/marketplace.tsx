import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { SubmitBidDialog } from '#/components/dashboard/SubmitBidDialog'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { getDriverMarketplaceData } from '#/lib/api/dashboard'
import type {
  DashboardListData,
  DashboardListItem,
  DashboardStatusVariant,
} from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/driver/marketplace')({
  component: DriverMarketplacePage,
})

type DriverMarketplaceResponse = {
  matches: DashboardListData
  expiringSoon: DashboardListData
  newest: DashboardListData
}
type AvailableItinerary = {
  pickupLocation: string
  destination: string
  tourist: {
    name: string
    email: string
    role: string
    userId: number
  }
  bids: unknown[]
  itineraryId: number
  status: string
}

const getStatusVariant = (status: string): DashboardStatusVariant => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'ACCEPTED':
      return 'success'
    case 'REJECTED':
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const mapAvailableItineraries = (
  itineraries: AvailableItinerary[],
): DriverMarketplaceResponse => {
  const mappedItems: DashboardListItem[] = itineraries.map((itinerary) => ({
    id: String(itinerary.itineraryId),
    title: `${itinerary.pickupLocation} to ${itinerary.destination}`,
    subtitle: `Tourist: ${itinerary.tourist.name}`,
    meta: `${itinerary.bids.length} bids`,
    status: itinerary.status,
    statusVariant: getStatusVariant(itinerary.status),
  }))

  const sortedByNewest = [...mappedItems].sort((a, b) => {
    const aId = Number(a.id ?? 0)
    const bId = Number(b.id ?? 0)
    return bId - aId
  })

  const pendingItems = mappedItems.filter((item) => item.status === 'PENDING')

  return {
    matches: {
      title: 'Best matches',
      description: 'Itineraries that fit your routes.',
      items: pendingItems,
    } satisfies DashboardListData,
    expiringSoon: {
      title: 'Expiring soon',
      description: 'Bids that close within 24 hours.',
      items: [],
    } satisfies DashboardListData,
    newest: {
      title: 'Newest requests',
      description: 'Fresh itineraries from tourists.',
      items: sortedByNewest,
    } satisfies DashboardListData,
  }
}

function DriverMarketplacePage() {
  const {
    data: marketplaceData,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-marketplace'],
    queryFn: async () => {
      const itineraries = await api<AvailableItinerary[]>(
        '/itineraries/available',
      )
      return mapAvailableItineraries(itineraries)
    },
    initialData: getDriverMarketplaceData(),
  })

  const resolvedMarketplaceData = marketplaceData ?? getDriverMarketplaceData()

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
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-(--status-error)">
          {error instanceof Error
            ? error.message
            : 'Unable to load marketplace.'}
        </p>
      ) : null}
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          {...resolvedMarketplaceData.matches}
          renderItemActions={(item) => <SubmitBidDialog item={item} />}
        />
        <DashboardListCard
          {...resolvedMarketplaceData.expiringSoon}
          renderItemActions={(item) => <SubmitBidDialog item={item} />}
        />
        <DashboardListCard
          {...resolvedMarketplaceData.newest}
          renderItemActions={(item) => <SubmitBidDialog item={item} />}
        />
      </section>
    </DashboardShell>
  )
}
