import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { getAdminFeedbackData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/admin/feedback')({
  component: AdminFeedbackPage,
})

function AdminFeedbackPage() {
  const data = getAdminFeedbackData()

  return (
    <DashboardShell
      title="Feedback"
      subtitle="Moderate reviews and respond to reports."
      roleLabel="Admin"
      navItems={adminNavItems}
      actions={
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">View flagged</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Flagged reviews</DialogTitle>
                <DialogDescription>
                  Inspect reviews needing moderation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-flagged-review-id">Review ID</Label>
                  <Input id="admin-flagged-review-id" placeholder="REV-2001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-flagged-rating">Rating</Label>
                  <Input id="admin-flagged-rating" placeholder="1 - 5" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Close
                  </Button>
                </DialogClose>
                <Button type="button">Refresh list</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Moderate review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Moderate review</DialogTitle>
                <DialogDescription>
                  Resolve or respond to a flagged review.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-moderate-review-id">Review ID</Label>
                  <Input id="admin-moderate-review-id" placeholder="REV-2001" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="admin-moderate-notes">Notes</Label>
                  <Input
                    id="admin-moderate-notes"
                    placeholder="Resolution details"
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
                <Button type="button">Resolve review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <DashboardListCard {...data.flagged} />
        <DashboardListCard {...data.recent} />
      </section>
    </DashboardShell>
  )
}
