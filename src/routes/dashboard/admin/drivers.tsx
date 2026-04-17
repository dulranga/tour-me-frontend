import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/admin/drivers')({
  component: AdminDriversPage,
})

type DriverAccount = {
  userId: number
  name: string
  email: string
  licenseNumber: string
  status: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
  createdAt: string
}

function AdminDriversPage() {
  const queryClient = useQueryClient()

  const {
    data: drivers,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: () => api<DriverAccount[]>('/drivers'),
  })

  const approveMutation = useMutation({
    mutationFn: (driverId: number) =>
      api(`/drivers/${driverId}/approve`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Driver approved')
      void queryClient.invalidateQueries({ queryKey: ['admin-drivers'] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to approve')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (driverId: number) =>
      api(`/drivers/${driverId}/reject`, { method: 'POST' }),
    onSuccess: () => {
      toast.success('Driver rejected')
      void queryClient.invalidateQueries({ queryKey: ['admin-drivers'] })
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to reject')
    },
  })

  const groupedDrivers = {
    verificationQueue: {
      title: 'Verification queue',
      description: 'Drivers awaiting approval.',
      items: [] as DashboardListItem[],
    },
    activeDrivers: {
      title: 'Active drivers',
      description: 'Verified and active.',
      items: [] as DashboardListItem[],
    },
  }

  if (drivers) {
    drivers.forEach((driver) => {
      const item: DashboardListItem = {
        id: driver.userId.toString(),
        title: driver.name,
        subtitle: driver.email,
        meta: new Date(driver.createdAt).toLocaleDateString(),
        status: driver.status,
        statusVariant:
          driver.status === 'VERIFIED'
            ? 'success'
            : driver.status === 'PENDING_VERIFICATION'
              ? 'warning'
              : 'destructive',
      }

      if (driver.status === 'PENDING_VERIFICATION') {
        groupedDrivers.verificationQueue.items.push(item)
      } else if (driver.status === 'VERIFIED') {
        groupedDrivers.activeDrivers.items.push(item)
      }
    })
  }

  const renderVerificationActions = (item: DashboardListItem) => {
    const driver = drivers?.find((d) => d.userId.toString() === item.id)
    if (!driver || driver.status !== 'PENDING_VERIFICATION') return null

    return (
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
              <Button
                type="button"
                onClick={() => approveMutation.mutate(driver.userId)}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? 'Approving...' : 'Approve'}
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
              <Button
                type="button"
                variant="destructive"
                onClick={() => rejectMutation.mutate(driver.userId)}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <DashboardShell
      title="Drivers"
      subtitle="Manage verification queues and driver status."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading drivers...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load drivers'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...groupedDrivers.verificationQueue}
            renderItemActions={renderVerificationActions}
          />
          <DashboardListCard {...groupedDrivers.activeDrivers} />
        </section>
      )}
    </DashboardShell>
  )
}
