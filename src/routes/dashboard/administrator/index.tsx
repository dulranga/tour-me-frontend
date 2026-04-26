import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckSquare, Flag, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { StatCard } from '#/components/dashboard/StatCard'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
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
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/administrator/')({
  component: AdminDashboard,
})

type AdminStats = {
  pendingVerifications: number
  openDisputes: number
  completedTrips: number
  flaggedAccounts: number
}

type PendingDriver = {
  userId: number
  name: string
  email: string
  createdAt: string
}

type DisputeItem = {
  disputeId: number
  tripId: number
  issue: string
  status: string
  createdAt: string
}

function AdminDashboard() {
  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () =>
      api<AdminStats>('/administrator/stats').catch(() => ({
        pendingVerifications: 0,
        openDisputes: 0,
        completedTrips: 0,
        flaggedAccounts: 0,
      })),
  })

  // Fetch pending driver verifications
  const { data: pendingDrivers } = useQuery({
    queryKey: ['pending-drivers'],
    queryFn: () => api<PendingDriver[]>('/drivers?status=PENDING_VERIFICATION'),
  })

  // Fetch open disputes
  const { data: disputes } = useQuery({
    queryKey: ['open-disputes'],
    queryFn: () => api<DisputeItem[]>('/disputes?status=OPEN'),
  })

  const iconMap: Record<string, LucideIcon> = {
    'shield-check': ShieldCheck,
    'alert-triangle': AlertTriangle,
    'check-square': CheckSquare,
    flag: Flag,
  }

  const statCards = [
    {
      title: 'Pending verifications',
      value: stats?.pendingVerifications ?? 0,
      description: 'Drivers awaiting review',
      icon: 'shield-check',
    },
    {
      title: 'Open disputes',
      value: stats?.openDisputes ?? 0,
      description: 'Awaiting resolution',
      icon: 'alert-triangle',
    },
    {
      title: 'Completed trips',
      value: stats?.completedTrips ?? 0,
      description: 'This month',
      icon: 'check-square',
    },
    {
      title: 'Flagged accounts',
      value: stats?.flaggedAccounts ?? 0,
      description: 'Suspicious activity',
      icon: 'flag',
    },
  ]

  const verificationQueue: DashboardListData = {
    title: 'Verification queue',
    description: 'Drivers awaiting approval',
    items: [] as DashboardListItem[],
  }

  if (pendingDrivers) {
    pendingDrivers.slice(0, 5).forEach((driver) => {
      verificationQueue.items.push({
        id: driver.userId.toString(),
        title: driver.name,
        subtitle: driver.email,
        meta: new Date(driver.createdAt).toLocaleDateString(),
        status: 'Pending',
        statusVariant: 'warning',
      })
    })
  }

  const disputeQueue: DashboardListData = {
    title: 'Dispute queue',
    description: 'Issues needing resolution',
    items: [] as DashboardListItem[],
  }

  if (disputes) {
    disputes.slice(0, 5).forEach((dispute) => {
      disputeQueue.items.push({
        id: dispute.disputeId.toString(),
        title: `Trip #${dispute.tripId}`,
        subtitle: dispute.issue,
        meta: new Date(dispute.createdAt).toLocaleDateString(),
        status: dispute.status,
        statusVariant: 'destructive',
      })
    })
  }

  const renderVerificationActions = (item: DashboardListItem) => (
    <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve driver</DialogTitle>
            <DialogDescription>
              Confirm approval for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject driver</DialogTitle>
            <DialogDescription>
              Confirm rejection for {item.title}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  const renderDisputeAction = () => (
    <Button size="sm" variant="outline" disabled>
      View dispute
    </Button>
  )

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Review verifications, monitor trips, and resolve disputes across the platform."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = iconMap[stat.icon] ?? ShieldCheck

          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              trend={undefined}
              icon={<Icon className="h-5 w-5" />}
            />
          )
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <DashboardListCard
            {...verificationQueue}
            renderItemActions={renderVerificationActions}
          />
          <DashboardListCard
            {...disputeQueue}
            renderItemActions={renderDisputeAction}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Admin checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-text-secondary">
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Resolve disputes within 48 hours to keep driver ratings accurate.
            </div>
            <div className="rounded-md border border-border-subtle bg-bg-base/40 p-3">
              Verify documents before peak travel dates to keep supply steady.
            </div>
            <Button className="w-full" disabled>
              Open moderation tools
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DashboardListCard
          title="Trip monitoring"
          description="Recent platform activity"
          items={[]}
        />
        <DashboardListCard
          title="Feedback moderation"
          description="Recent reviews"
          items={[]}
        />
        <DashboardListCard
          title="Marketplace activity"
          description="Bid trends"
          items={[]}
        />
      </section>
    </DashboardShell>
  )
}
