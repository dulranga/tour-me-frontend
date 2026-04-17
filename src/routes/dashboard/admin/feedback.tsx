import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { adminNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListItem } from '#/lib/api/dashboard'

export const Route = createFileRoute('/dashboard/admin/feedback')({
  component: AdminFeedbackPage,
})

type Feedback = {
  feedbackId: number
  reviewerId: number
  revieweeId: number
  rating: number
  comment: string
  flagged: boolean
  createdAt: string
}

function AdminFeedbackPage() {
  const {
    data: feedback,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: () => api<Feedback[]>('/feedback'),
  })

  const groupedFeedback = {
    flagged: {
      title: 'Flagged reviews',
      description: 'Inappropriate content.',
      items: [] as DashboardListItem[],
    },
    recent: {
      title: 'Recent reviews',
      description: 'Latest feedback.',
      items: [] as DashboardListItem[],
    },
  }

  if (feedback) {
    feedback.forEach((fb) => {
      const item: DashboardListItem = {
        id: fb.feedbackId.toString(),
        title: `Rating: ${fb.rating}/5`,
        subtitle: fb.comment,
        meta: new Date(fb.createdAt).toLocaleDateString(),
        status: fb.flagged ? 'Flagged' : 'OK',
        statusVariant: fb.flagged ? 'destructive' : 'success',
      }

      if (fb.flagged) {
        groupedFeedback.flagged.items.push(item)
      } else {
        groupedFeedback.recent.items.push(item)
      }
    })
  }

  const renderFeedbackAction = () => (
    <Button size="sm" variant="outline" disabled>
      Review
    </Button>
  )

  return (
    <DashboardShell
      title="Feedback"
      subtitle="Moderate reviews and respond to reports."
      roleLabel="Admin"
      navItems={adminNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading feedback...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load feedback'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-2">
          <DashboardListCard
            {...groupedFeedback.flagged}
            renderItemActions={renderFeedbackAction}
          />
          <DashboardListCard
            {...groupedFeedback.recent}
            renderItemActions={renderFeedbackAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
