import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminDisputesData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/disputes')({
  component: AdminDisputesPage,
})

function AdminDisputesPage() {
  const data = getAdminDisputesData()
  const renderDisputeAction = () => (
    <Button size="sm" variant="outline" disabled>
      View dispute
    </Button>
  )

  return (
    <DashboardShell
      title="Disputes"
      subtitle="Resolve issues reported by tourists and drivers."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.openDisputes}
          renderItemActions={renderDisputeAction}
        />
        <DashboardListCard
          {...data.resolved}
          renderItemActions={renderDisputeAction}
        />
      </section>
    </DashboardShell>
  )
}
