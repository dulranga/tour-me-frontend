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

export const Route = createFileRoute('/dashboard/admin/drivers')({
  component: AdminDriversPage,
})

function AdminDriversPage() {
  const data = getAdminDriversData()
  const renderVerificationActions = (item: { title: string }) => (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve driver</DialogTitle>
            <DialogDescription>
              Confirm approval for {item.title}.
            </DialogDescription>
          </DialogHeader>
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
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject driver</DialogTitle>
            <DialogDescription>
              Confirm rejection for {item.title}.
            </DialogDescription>
          </DialogHeader>
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
  )

  return (
    <DashboardShell
      title="Drivers"
      subtitle="Manage verification queues and driver status."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.verificationQueue}
          renderItemActions={renderVerificationActions}
        />
        <DashboardListCard {...data.activeDrivers} />
      </section>
    </DashboardShell>
  )
}
