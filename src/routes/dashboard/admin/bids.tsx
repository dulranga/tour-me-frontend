import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminBidsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/admin/bids')({
  component: AdminBidsPage,
})

function AdminBidsPage() {
  const data = getAdminBidsData()

  return (
    <DashboardShell
      title="Bids"
      subtitle="Monitor marketplace activity and stalled itineraries."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              Export report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export bids report</DialogTitle>
              <DialogDescription>
                Generate a bid activity report for a date range.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-bids-start">Start date</Label>
                <Input id="admin-bids-start" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-bids-end">End date</Label>
                <Input id="admin-bids-end" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="admin-bids-status">Status filter</Label>
                <Input id="admin-bids-status" placeholder="Submitted" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Generate export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.openBids} />
        <DashboardListCard {...data.stalledItineraries} />
      </section>
    </DashboardShell>
  )
}
