import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverVerificationData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/driver/verification')({
  component: DriverVerificationPage,
})

function DriverVerificationPage() {
  const data = getDriverVerificationData()

  return (
    <DashboardShell
      title="Verification"
      subtitle="Keep your documents up to date to stay visible."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Button size="sm" disabled>
          Upload documents
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.documents} />
        <DashboardListCard {...data.followUps} />
      </section>
    </DashboardShell>
  )
}
