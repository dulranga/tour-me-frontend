import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/tourist/receipts')({
  component: TouristReceiptsPage,
})

type Receipt = {
  receiptId: number
  tripId: number
  amount: number
  status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  uploadedAt?: string
  createdAt: string
}

function TouristReceiptsPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  const {
    data: receipts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tourist-receipts', user.userId],
    queryFn: () => api<Receipt[]>(`/receipts/tourist/${user.userId}`),
  })

  const groupedReceipts = {
    pending: {
      title: 'Pending receipts',
      description: 'Receipts needing upload.',
      items: [] as DashboardListItem[],
    },
    submitted: {
      title: 'Submitted receipts',
      description: 'Under review.',
      items: [] as DashboardListItem[],
    },
  }

  if (receipts) {
    receipts.forEach((receipt) => {
      const item: DashboardListItem = {
        id: receipt.receiptId.toString(),
        title: `Trip #${receipt.tripId}`,
        subtitle: `LKR ${receipt.amount}`,
        meta: new Date(receipt.createdAt).toLocaleDateString(),
        status: receipt.status,
        statusVariant:
          receipt.status === 'PENDING'
            ? 'warning'
            : receipt.status === 'SUBMITTED'
              ? 'secondary'
              : receipt.status === 'APPROVED'
                ? 'success'
                : 'destructive',
      }

      if (receipt.status === 'PENDING') {
        groupedReceipts.pending.items.push(item)
      } else {
        groupedReceipts.submitted.items.push(item)
      }
    })
  }

  const renderReceiptAction = () => (
    <Button size="sm" variant="outline" disabled>
      Upload receipt
    </Button>
  )

  return (
    <DashboardShell
      title="Receipts"
      subtitle="Upload receipts and keep travel expenses organized."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading receipts...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load receipts'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <DashboardListCard
              {...groupedReceipts.pending}
              renderItemActions={renderReceiptAction}
            />
            <DashboardListCard
              {...groupedReceipts.submitted}
              renderItemActions={renderReceiptAction}
            />
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
            </CardContent>
          </Card>
        </section>
      )}
    </DashboardShell>
  )
}
