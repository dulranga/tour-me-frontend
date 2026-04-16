import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { getDriverMessagesData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/messages')({
  component: DriverMessagesPage,
})

function DriverMessagesPage() {
  const data = getDriverMessagesData()

  return (
    <DashboardShell
      title="Messages"
      subtitle="Stay in sync with tourists on active trips."
      roleLabel="Driver"
      navItems={driverNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">New message</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New message</DialogTitle>
              <DialogDescription>
                Start a new conversation with a tourist.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="driver-message-recipient">Recipient</Label>
                <Input
                  id="driver-message-recipient"
                  placeholder="Tourist ID or name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="driver-message-body">Message</Label>
                <Input
                  id="driver-message-body"
                  placeholder="Write your message"
                  className="h-24"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button">Send message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6">
        <DashboardListCard {...data.threads} />
      </section>
    </DashboardShell>
  )
}
