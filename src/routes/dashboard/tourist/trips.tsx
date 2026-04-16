import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristTripsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/trips')({
  component: TouristTripsPage,
})

function TouristTripsPage() {
  const data = getTouristTripsData()
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
              <Label htmlFor={`tourist-trip-status-${itemKey}`}>Status</Label>
              <Input
                id={`tourist-trip-status-${itemKey}`}
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
      subtitle="Monitor upcoming and completed trips with drivers."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.upcoming} />
        <DashboardListCard
          {...data.past}
          renderItemActions={renderCompletionAction}
        />
      </section>
    </DashboardShell>
  )
}
