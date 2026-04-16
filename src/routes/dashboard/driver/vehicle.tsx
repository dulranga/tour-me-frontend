import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverVehicleData } from '#/lib/api/dashboard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

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
        <Button size="sm" disabled>
          Edit vehicle
        </Button>
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
