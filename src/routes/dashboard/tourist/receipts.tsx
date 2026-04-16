import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristReceiptsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/tourist/receipts')({
  component: TouristReceiptsPage,
})

function TouristReceiptsPage() {
  const data = getTouristReceiptsData()

  return (
    <DashboardShell
      title="Receipts"
      subtitle="Upload receipts and keep travel expenses organized."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Button size="sm" disabled>
          Upload receipt
        </Button>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard {...data.pending} />
          <DashboardListCard {...data.submitted} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Receipt checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Upload receipts within 7 days of trip completion.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Include fuel, tolls, and parking expenses for review.
            </div>
            <Button className="w-full" variant="outline" disabled>
              Upload receipt
            </Button>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
