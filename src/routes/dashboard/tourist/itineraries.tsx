import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristItinerariesData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/tourist/itineraries')({
  component: TouristItinerariesPage,
})

function TouristItinerariesPage() {
  const data = getTouristItinerariesData()

  return (
    <DashboardShell
      title="Itineraries"
      subtitle="Manage draft plans, open bids, and confirmed itineraries."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Button size="sm" disabled>
          New itinerary
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.drafts} />
        <DashboardListCard {...data.openForBids} />
        <DashboardListCard {...data.confirmed} />
      </section>
    </DashboardShell>
  )
}
