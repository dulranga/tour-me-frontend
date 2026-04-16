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
  const vehicleDetailKey = 'driver-vehicle-details'

  return (
    <DashboardShell
      title="Vehicle"
      subtitle="Manage vehicle information and maintenance reminders."
      roleLabel="Driver"
      navItems={driverNavItems}
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Edit vehicle</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit vehicle details</DialogTitle>
                  <DialogDescription>
                    Update the vehicle details associated with your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={vehicleDetailKey}>Vehicle details</Label>
                    <Input
                      id={vehicleDetailKey}
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
          </CardContent>
        </Card>
        <DashboardListCard {...data.reminders} />
      </section>
    </DashboardShell>
  )
}
