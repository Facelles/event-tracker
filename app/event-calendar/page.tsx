import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/src/auth'
import { getEvents } from '@/src/actions/events'
import DashboardClient from '@/components/dashboard/DashboardClient'
import type { SerializedEvent } from '@/src/types/events'

export const metadata: Metadata = { title: 'My Events | EventFlow' }

export default async function EventCalendarPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const result = await getEvents()

  const events: SerializedEvent[] = result.success
    ? result.data.map(ev => ({
        id: ev.id,
        title: ev.title,
        description: ev.description,
        dateTime: ev.dateTime.toISOString(),
        importance: ev.importance,
        userId: ev.userId,
      }))
    : []

  return (
    <DashboardClient
      initialEvents={events}
      userName={session.user.name ?? session.user.email ?? 'there'}
    />
  )
}
