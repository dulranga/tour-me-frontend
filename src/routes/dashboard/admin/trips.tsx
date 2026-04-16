import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminTripsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/trips')({
  component: AdminTripsPage,
})

function AdminTripsPage() {
  const data = getAdminTripsData()

  return (
    <DashboardShell
      title="Trips"
      subtitle="Monitor active trips and completion confirmations."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Button size="sm" disabled>
          View trip details
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.inProgress} />
        <DashboardListCard {...data.awaitingConfirmation} />
      </section>
    </DashboardShell>
  )
}
