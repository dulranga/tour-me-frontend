import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { getTouristReceiptsData } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/tourist/receipts')({
  component: TouristReceiptsPage,
})

function TouristReceiptsPage() {
  const data = getTouristReceiptsData()

  return (
    <DashboardShell
      title="Receipts"
      subtitle="Upload receipts and keep travel expenses organized."
      roleLabel="Tourist"
      navItems={touristNavItems}
      actions={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Upload receipt</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload receipt</DialogTitle>
              <DialogDescription>
                Submit a travel expense receipt for review.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tourist-receipt-amount-main">Amount</Label>
                <Input
                  id="tourist-receipt-amount-main"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-receipt-file-main">Receipt file</Label>
                <Input id="tourist-receipt-file-main" type="file" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tourist-receipt-notes-main">Notes</Label>
                <Input
                  id="tourist-receipt-notes-main"
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
              <Button type="button">Upload receipt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard {...data.pending} />
          <DashboardListCard {...data.submitted} />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Receipt checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Upload receipts within 7 days of trip completion.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Include fuel, tolls, and parking expenses for review.
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  Upload receipt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload receipt</DialogTitle>
                  <DialogDescription>
                    Submit a travel expense receipt for review.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-receipt-amount-side">Amount</Label>
                    <Input
                      id="tourist-receipt-amount-side"
                      type="number"
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-receipt-file-side">Receipt file</Label>
                    <Input id="tourist-receipt-file-side" type="file" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tourist-receipt-notes-side">Notes</Label>
                    <Input
                      id="tourist-receipt-notes-side"
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
                  <Button type="button">Upload receipt</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  )
}
