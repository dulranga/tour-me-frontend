import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristMessagesData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/messages')({
  component: TouristMessagesPage,
})

function TouristMessagesPage() {
  const data = getTouristMessagesData()

  return (
    <DashboardShell
      title="Messages"
      subtitle="Stay aligned with drivers before and during your trips."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">New message</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New message</DialogTitle>
              <DialogDescription>
                Start a new conversation with a driver.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tourist-message-recipient">Driver ID</Label>
                <Input
                  id="tourist-message-recipient"
                  placeholder="DRV-1001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-message-body">Message</Label>
                <Input
                  id="tourist-message-body"
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
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DashboardListCard {...data.threads} />
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Response tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Confirm pickup times and locations 24 hours before departure.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Share any itinerary changes early to keep bids accurate.
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Open chat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Open chat</DialogTitle>
                  <DialogDescription>
                    Load an existing message thread.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-thread-id">Thread ID</Label>
                    <Input id="tourist-thread-id" placeholder="THR-4820" />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" type="button">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="button">Open thread</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
} 