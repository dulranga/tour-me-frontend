import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverTripsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/trips')({
  component: DriverTripsPage,
})

function DriverTripsPage() {
  const data = getDriverTripsData()
  const renderCompletionAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Confirm completion
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm trip completion</DialogTitle>
            <DialogDescription>
              Mark {item.title} as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`driver-completion-status-${itemKey}`}>
                Status
              </Label>
              <Input
                id={`driver-completion-status-${itemKey}`}
                placeholder="COMPLETED"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Confirm completion</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Trips"
      subtitle="Manage upcoming and completed trips."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.upcoming} />
        <DashboardListCard
          {...data.completed}
          renderItemActions={renderCompletionAction}
        />
      </section>
    </DashboardShell>
  )
}
