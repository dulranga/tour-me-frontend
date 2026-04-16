import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristBidsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/dashboard/tourist/bids')({
  component: TouristBidsPage,
})

function TouristBidsPage() {
  const data = getTouristBidsData()

  return (
    <DashboardShell
      title="Bids"
      subtitle="Compare offers from verified drivers before you decide."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Button size="sm" disabled>
          Compare bids
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.newBids} />
        <DashboardListCard {...data.expiringSoon} />
        <DashboardListCard {...data.accepted} />
      </section>
    </DashboardShell>
  )
}
