import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckSquare, Flag, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminOverviewData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const data = getAdminOverviewData()
  const iconMap: Record<string, LucideIcon> = {
    'shield-check': ShieldCheck,
    'alert-triangle': AlertTriangle,
    'check-square': CheckSquare,
    flag: Flag,
  }

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Review verifications, monitor trips, and resolve disputes across the platform."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <>
          <Button size="sm" disabled>
            Review drivers
          </Button>
          <Button size="sm" variant="outline" disabled>
            View disputes
          </Button>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = iconMap[stat.icon] ?? ShieldCheck

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              trend={stat.trend}
              icon={<Icon className="h-5 w-5" />}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard {...data.verificationQueue} />
          <DashboardListCard {...data.disputeQueue} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Admin checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Resolve disputes within 48 hours to keep driver ratings accurate.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Verify documents before peak travel dates to keep supply steady.
            </div>
            <Button className="w-full" disabled>
              Open moderation tools
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard {...data.tripMonitoring} />
        <DashboardListCard {...data.feedbackModeration} />
        <DashboardListCard {...data.marketplaceActivity} />
      </section>
    </DashboardShell>
  )
}
