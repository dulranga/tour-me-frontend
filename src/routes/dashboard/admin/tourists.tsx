import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminTouristsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/tourists')({
  component: AdminTouristsPage,
})

function AdminTouristsPage() {
  const data = getAdminTouristsData()
  const renderReportAction = () => (
    <Button size="sm" variant="outline" disabled>
      View report
    </Button>
  )

  return (
    <DashboardShell
      title="Tourists"
      subtitle="Review tourist accounts and recent activity."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.activeTourists}
          renderItemActions={renderReportAction}
        />
        <DashboardListCard
          {...data.flagged}
          renderItemActions={renderReportAction}
        />
      </section>
    </DashboardShell>
  )
}
