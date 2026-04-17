import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

import { DashboardListCard } from '#/components/dashboard/DashboardListCard'
import { DashboardShell } from '#/components/dashboard/DashboardShell'
import { driverNavItems } from '#/components/dashboard/navigation'
import { api } from '#/lib/api/client'
import { Button } from '#/components/ui/button'
import type { DashboardListData, DashboardListItem } from '#/lib/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/dashboard/driver/messages')({
  component: DriverMessagesPage,
})

type MessageThread = {
  threadId: number
  touristId: number
  driverId: number
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

function DriverMessagesPage() {
  const { user } = useRouteContext({ from: '/dashboard' })

  const {
    data: threads,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['driver-messages', user.userId],
    queryFn: () => api<MessageThread[]>(`/messages/driver/${user.userId}`),
  })

  const messageThreads: DashboardListData = {
    title: 'Message threads',
    description: 'Conversations with tourists.',
    items: [] as DashboardListItem[],
  }

  if (threads) {
    threads.forEach((thread) => {
      messageThreads.items.push({
        id: thread.threadId.toString(),
        title: `Tourist #${thread.touristId}`,
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
      subtitle="Stay in sync with tourists on active trips."
      roleLabel="Driver"
      navItems={driverNavItems}
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
        <section className="grid gap-6">
          <DashboardListCard
            {...messageThreads}
            renderItemActions={renderMessageAction}
          />
        </section>
      )}
    </DashboardShell>
  )
}
