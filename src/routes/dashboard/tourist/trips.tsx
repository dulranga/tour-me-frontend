import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristTripsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/tourist/trips')({
  component: TouristTripsPage,
})

function TouristTripsPage() {
  const data = getTouristTripsData()

  return (
    <DashboardShell
      title="Trips"
      subtitle="Monitor upcoming and completed trips with drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Button size="sm" variant="outline" disabled>
          Confirm completion
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.upcoming} />
        <DashboardListCard {...data.past} />
      </section>
    </DashboardShell>
  )
}
