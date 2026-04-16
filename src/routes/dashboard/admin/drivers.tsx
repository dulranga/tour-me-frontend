import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminDriversData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/admin/drivers')({
  component: AdminDriversPage,
})

function AdminDriversPage() {
  const data = getAdminDriversData()

  return (
    <DashboardShell
      title="Drivers"
      subtitle="Manage verification queues and driver status."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <div className="flex flex-wrap gap-2">
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
                  <Label htmlFor="admin-driver-queue-status">Status</Label>
                  <Input id="admin-driver-queue-status" placeholder="Pending" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-driver-queue-id">Driver ID</Label>
                  <Input id="admin-driver-queue-id" placeholder="DRV-1001" />
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
                  <Label htmlFor="admin-driver-approve-id">Driver ID</Label>
                  <Input id="admin-driver-approve-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-driver-approve-status">Status</Label>
                  <Input
                    id="admin-driver-approve-status"
                    value="Approved"
                    readOnly
                  />
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
                  <Label htmlFor="admin-driver-reject-id">Driver ID</Label>
                  <Input id="admin-driver-reject-id" placeholder="DRV-1001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-driver-reject-reason">Reason</Label>
                  <Input
                    id="admin-driver-reject-reason"
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
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.verificationQueue} />
        <DashboardListCard {...data.activeDrivers} />
      </section>
    </DashboardShell>
  )
}
