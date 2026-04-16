import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminBidsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/bids')({
  component: AdminBidsPage,
})

function AdminBidsPage() {
  const data = getAdminBidsData()

  return (
    <DashboardShell
      title="Bids"
      subtitle="Monitor marketplace activity and stalled itineraries."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.openBids}
          headerAction={
            <Button size="sm" variant="outline" disabled>
              Export report
            </Button>
          }
        />
        <DashboardListCard {...data.stalledItineraries} />
      </section>
    </DashboardShell>
  )
}
