import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverVehicleData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/vehicle')({
  component: DriverVehiclePage,
})

function DriverVehiclePage() {
  const data = getDriverVehicleData()

  return (
    <DashboardShell
      title="Vehicle"
      subtitle="Manage vehicle information and maintenance reminders."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Edit vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit vehicle details</DialogTitle>
              <DialogDescription>
                Update your vehicle profile and compliance data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-name">Vehicle name</Label>
                <Input id="driver-vehicle-name" placeholder="Toyota Hiace" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-plate">Plate number</Label>
                <Input id="driver-vehicle-plate" placeholder="WP-KB-1234" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-seats">Seats</Label>
                <Input
                  id="driver-vehicle-seats"
                  type="number"
                  placeholder="12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-status">Status</Label>
                <Input id="driver-vehicle-status" placeholder="Active" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-insurance">Insurance</Label>
                <Input
                  id="driver-vehicle-insurance"
                  placeholder="Valid through 2026"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-vehicle-inspection">Last inspection</Label>
                <Input id="driver-vehicle-inspection" type="date" />
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
      }
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Vehicle</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Plate</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.plate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Seats</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.seats}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Status</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Insurance</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.insurance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Last inspection</span>
              <span className="font-semibold text-text-primary">
                {data.vehicle.lastInspection}
              </span>
            </div>
          </CardContent>
        </Card>
        <DashboardListCard {...data.reminders} />
      </section>
    </DashboardShell>
  )
}
