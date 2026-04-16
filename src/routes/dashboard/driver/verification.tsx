import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverVerificationData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/verification')({
  component: DriverVerificationPage,
})

function DriverVerificationPage() {
  const data = getDriverVerificationData()
  const renderVerificationAction = (item: { title: string }) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update details
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update driver details</DialogTitle>
            <DialogDescription>
              Update license and vehicle details for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`driver-license-${itemKey}`}>License number</Label>
              <Input
                id={`driver-license-${itemKey}`}
                placeholder="LIC-000123"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`driver-vehicle-${itemKey}`}>
                Vehicle details
              </Label>
              <Input
                id={`driver-vehicle-${itemKey}`}
                placeholder="Toyota Prius, 4 seats"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Verification"
      subtitle="Keep your documents up to date to stay visible."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard
          {...data.documents}
          renderItemActions={renderVerificationAction}
        />
        <DashboardListCard
          {...data.followUps}
          renderItemActions={renderVerificationAction}
        />
      </section>
    </DashboardShell>
  )
}
