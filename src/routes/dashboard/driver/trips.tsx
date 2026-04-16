import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverTripsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/driver/trips')({
  component: DriverTripsPage,
})

function DriverTripsPage() {
  const data = getDriverTripsData()

  return (
    <DashboardShell
      title="Trips"
      subtitle="Manage upcoming and completed trips."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Button size="sm" variant="outline" disabled>
          Confirm completion
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.upcoming} />
        <DashboardListCard {...data.completed} />
      </section>
    </DashboardShell>
  )
}
