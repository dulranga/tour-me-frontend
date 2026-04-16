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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

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
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">View driver queue</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Driver verification queue</DialogTitle>
                <DialogDescription>
                  Review pending driver submissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-queue-status">Status filter</Label>
                  <Input id="admin-queue-status" placeholder="Pending" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-queue-driver-id">Driver ID</Label>
                  <Input id="admin-queue-driver-id" placeholder="DRV-1001" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Close
                  </Button>
                </DialogClose>
                <Button type="button">Refresh queue</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Approve driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Approve driver</DialogTitle>
                <DialogDescription>
                  Move a verified driver to approved status.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-approve-driver-id">Driver ID</Label>
                  <Input id="admin-approve-driver-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-approve-status">Status</Label>
                  <Input id="admin-approve-status" value="Approved" readOnly />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button">Approve</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Reject driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject driver</DialogTitle>
                <DialogDescription>
                  Request revisions for incomplete documentation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-reject-driver-id">Driver ID</Label>
                  <Input id="admin-reject-driver-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-reject-reason">Reason</Label>
                  <Input
                    id="admin-reject-reason"
                    placeholder="Missing insurance proof"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="button">Reject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
