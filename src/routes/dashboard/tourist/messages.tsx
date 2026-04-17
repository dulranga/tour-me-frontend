import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { touristNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/tourist/messages')({
  component: TouristMessagesPage,
})

type MessageThread = {
  threadId: number
  driverId: number
  touristId: number
  driverName: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

function TouristMessagesPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  const {
    data: threads,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tourist-messages', user.userId],
    queryFn: () => api<MessageThread[]>(`/messages/tourist/${user.userId}`),
  })

  const messageThreads: DashboardListData = {
    title: 'Message threads',
    description: 'Conversations with drivers.',
    items: [] as DashboardListItem[],
  }

  if (threads) {
    threads.forEach((thread) => {
      messageThreads.items.push({
        id: thread.threadId.toString(),
        title: thread.driverName || `Driver #${thread.driverId}`,
        subtitle: thread.lastMessage,
        meta: new Date(thread.lastMessageTime).toLocaleDateString(),
        status: thread.unreadCount > 0 ? 'Unread' : 'Read',
        statusVariant: thread.unreadCount > 0 ? 'secondary' : 'outline',
      })
    })
  }

  const renderMessageAction = () => (
    <Button size="sm" variant="outline" disabled>
      Open chat
    </Button>
  )

  return (
    <DashboardShell
      title="Messages"
      subtitle="Stay aligned with drivers before and during your trips."
      roleLabel="Tourist"
      navItems={touristNavItems}
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading messages...</p>
      )}
      {isError && (
        <p className="rounded-md border border-border-subtle bg-bg-elevated px-3 py-2 text-sm text-[color:var(--status-error)]">
          {error instanceof Error ? error.message : 'Failed to load messages'}
        </p>
      )}
      {!isLoading && !isError && (
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <DashboardListCard
            {...messageThreads}
            renderItemActions={renderMessageAction}
          />
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
              <Button className="w-full" variant="outline" disabled>
                Open chat
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </DashboardShell>
  )
}
