import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverBidsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/driver/bids')({
  component: DriverBidsPage,
})

function DriverBidsPage() {
  const data = getDriverBidsData()

  return (
    <DashboardShell
      title="Bids"
      subtitle="Track pending, accepted, and declined bids."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Button size="sm" variant="outline" disabled>
          Update bids
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.pending} />
        <DashboardListCard {...data.accepted} />
        <DashboardListCard {...data.declined} />
      </section>
    </DashboardShell>
  )
}
