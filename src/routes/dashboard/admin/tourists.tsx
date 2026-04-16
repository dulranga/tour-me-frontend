import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminTouristsData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
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

export const Route = createFileRoute('/dashboard/admin/tourists')({
  component: AdminTouristsPage,
})

function AdminTouristsPage() {
  const data = getAdminTouristsData()

  return (
    <DashboardShell
      title="Tourists"
      subtitle="Review tourist accounts and recent activity."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">View reports</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tourist reports</DialogTitle>
              <DialogDescription>
                Review flagged tourist activity and reports.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-tourist-report-id">Report ID</Label>
                <Input id="admin-tourist-report-id" placeholder="REP-3102" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-tourist-id">Tourist ID</Label>
                <Input id="admin-tourist-id" placeholder="TOUR-9001" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Close
                </Button>
              </DialogClose>
              <Button type="button">Refresh reports</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.activeTourists} />
        <DashboardListCard {...data.flagged} />
      </section>
    </DashboardShell>
  )
}
