import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristMessagesData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/tourist/messages')({
  component: TouristMessagesPage,
})

function TouristMessagesPage() {
  const data = getTouristMessagesData()
  const renderMessageAction = () => (
    <Button size="sm" variant="outline" disabled>
      Open chat
    </Button>
  )

  return (
    <DashboardShell
      title="Messages"
      subtitle="Stay aligned with drivers before and during your trips."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DashboardListCard
          {...data.threads}
          renderItemActions={renderMessageAction}
        />
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Response tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Confirm pickup times and locations 24 hours before departure.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Share any itinerary changes early to keep bids accurate.
            </div>
            <Button className="w-full" variant="outline" disabled>
              Open chat
            </Button>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
} 