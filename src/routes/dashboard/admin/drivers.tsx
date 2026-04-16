import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminDriversData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/drivers')({
  component: AdminDriversPage,
})

function AdminDriversPage() {
  const data = getAdminDriversData()

  return (
    <DashboardShell
      title="Drivers"
      subtitle="Manage verification queues and driver status."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Button size="sm" disabled>
          Review drivers
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.verificationQueue} />
        <DashboardListCard {...data.activeDrivers} />
      </section>
    </DashboardShell>
  )
}
