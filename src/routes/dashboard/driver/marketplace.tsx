import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverMarketplaceData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/driver/marketplace')({
  component: DriverMarketplacePage,
})

function DriverMarketplacePage() {
  const data = getDriverMarketplaceData()

  return (
    <DashboardShell
      title="Marketplace"
      subtitle="Browse itineraries that match your routes and availability."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Button size="sm" disabled>
          Submit bid
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.matches} />
        <DashboardListCard {...data.expiringSoon} />
        <DashboardListCard {...data.newest} />
      </section>
    </DashboardShell>
  )
}
