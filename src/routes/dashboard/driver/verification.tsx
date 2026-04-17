import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'
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

export const Route = createFileRoute('/dashboard/driver/verification')({
  component: DriverVerificationPage,
})

type Document = {
  documentId: number
  driverId: number
  type: 'LICENSE' | 'VEHICLE_REGISTRATION' | 'INSURANCE'
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'REJECTED'
  expiryDate?: string
  verifiedAt?: string
}

function DriverVerificationPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  const {
    data: documents,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-documents', user.userId],
    queryFn: () => api<Document[]>(`/documents/driver/${user.userId}`),
  })

  const groupedDocuments = {
    documents: {
      title: 'Documents',
      description: 'Licenses, registrations, and insurance.',
      items: [] as DashboardListItem[],
    },
    followUps: {
      title: 'Follow-ups',
      description: 'Documents needing renewal.',
      items: [] as DashboardListItem[],
    },
  }

  if (documents) {
    documents.forEach((doc) => {
      const item: DashboardListItem = {
        id: doc.documentId.toString(),
        title: doc.type,
        subtitle: doc.status,
        meta: doc.expiryDate
          ? new Date(doc.expiryDate).toLocaleDateString()
          : 'No expiry',
        status: doc.status,
        statusVariant:
          doc.status === 'VERIFIED'
            ? 'success'
            : doc.status === 'PENDING'
              ? 'warning'
              : doc.status === 'EXPIRED'
                ? 'destructive'
                : 'outline',
      }

      if (doc.status === 'EXPIRED') {
        groupedDocuments.followUps.items.push(item)
      } else {
        groupedDocuments.documents.items.push(item)
      }
    })
  }

  const renderVerificationAction = (item: DashboardListItem) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, '-')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Update details
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update document</DialogTitle>
            <DialogDescription>Update {item.title} details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`driver-license-${itemKey}`}>
                Document number
              </Label>
              <Input
                id={`driver-license-${itemKey}`}
                placeholder="DOC-000123"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`driver-expiry-${itemKey}`}>Expiry date</Label>
              <Input id={`driver-expiry-${itemKey}`} type="date" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DashboardShell
      title="Verification"
      subtitle="Keep your documents up to date to stay visible."
      roleLabel="Driver"
      navItems={driverNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading documents...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load documents'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...groupedDocuments.documents}
            renderItemActions={renderVerificationAction}
          />
          <DashboardListCard
            {...groupedDocuments.followUps}
            renderItemActions={renderVerificationAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
