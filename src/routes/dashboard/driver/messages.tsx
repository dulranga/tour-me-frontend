import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverMessagesData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/driver/messages')({
  component: DriverMessagesPage,
})

function DriverMessagesPage() {
  const data = getDriverMessagesData()

  return (
    <DashboardShell
      title="Messages"
      subtitle="Stay in sync with tourists on active trips."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Button size="sm" disabled>
          New message
        </Button>
      }
    >
      <section className="grid gap-6">
        <DashboardListCard {...data.threads} />
      </section>
    </DashboardShell>
  )
}
