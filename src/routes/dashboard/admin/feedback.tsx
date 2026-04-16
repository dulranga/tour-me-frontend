import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminFeedbackData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/admin/feedback')({
  component: AdminFeedbackPage,
})

function AdminFeedbackPage() {
  const data = getAdminFeedbackData()

  return (
    <DashboardShell
      title="Feedback"
      subtitle="Moderate reviews and respond to reports."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Button size="sm" disabled>
          Review flagged
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.flagged} />
        <DashboardListCard {...data.recent} />
      </section>
    </DashboardShell>
  )
}
