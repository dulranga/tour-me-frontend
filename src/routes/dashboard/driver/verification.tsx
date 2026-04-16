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

  return (
    <DashboardShell
      title="Verification"
      subtitle="Keep your documents up to date to stay visible."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Upload documents</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload verification documents</DialogTitle>
              <DialogDescription>
                Submit updated files for admin review.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver-verification-license">Driver license</Label>
                <Input id="driver-verification-license" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-verification-registration">
                  Vehicle registration
                </Label>
                <Input id="driver-verification-registration" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-verification-notes">Notes</Label>
                <Input
                  id="driver-verification-notes"
                  placeholder="Add optional notes"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Submit documents</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.documents} />
        <DashboardListCard {...data.followUps} />
      </section>
    </DashboardShell>
  )
}
