'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import TopToolbar from '@/components/dashboard/TopToolbar'
import CalendarView from '@/components/dashboard/CalendarView'
import EventListView from '@/components/dashboard/EventListView'
import EventModal from '@/components/dashboard/EventModal'
import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog'
import type { SerializedEvent } from '@/src/types/events'
import { Importance } from '@prisma/client'
import { deleteEvent } from '@/src/actions/events'

interface Props {
  initialEvents: SerializedEvent[]
  userName: string
}

export default function DashboardClient({ initialEvents, userName }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState('')
  const [importance, setImportance] = useState<Importance | 'ALL'>('ALL')
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<SerializedEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>()
  
  const [deleteTarget, setDeleteTarget] = useState<SerializedEvent | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredEvents = initialEvents.filter(ev => {
    if (importance !== 'ALL' && ev.importance !== importance) return false
    if (search && !ev.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const refresh = () => startTransition(() => router.refresh())

  const openCreate = (date?: string) => { setEditEvent(null); setDefaultDate(date); setModalOpen(true) }
  const openEdit = (ev: SerializedEvent) => { setEditEvent(ev); setDefaultDate(undefined); setModalOpen(true) }
  const closeEdit = () => setModalOpen(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await deleteEvent(deleteTarget.id)
    setDeleting(false)
    setDeleteTarget(null)
    refresh()
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', px: { xs: 2, md: 4 }, py: 3, overflow: 'hidden' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            My Events
          </Typography>
          <Typography variant="body2" color="text.secondary">Welcome back, {userName}</Typography>
        </Box>
        <Button 
          variant="outlined" color="inherit" size="small"
          onClick={() => signOut({ callbackUrl: '/login' })}
          sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          Sign Out
        </Button>
      </Box>

      <TopToolbar
        search={search} importance={importance} view={view}
        onSearch={setSearch} onImportance={(v) => setImportance(v as Importance | 'ALL')} onView={(v) => setView(v as 'calendar' | 'list')}
        onAdd={openCreate}
      />

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {isPending && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,15,26,.6)', borderRadius: 3, zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}

        {view === 'calendar'
          ? <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}><CalendarView events={filteredEvents} onEdit={openEdit} onAddDay={openCreate} /></Box>
          : <Box sx={{ flex: 1, overflow: 'auto' }}><EventListView events={filteredEvents} onEdit={openEdit} onDelete={setDeleteTarget} /></Box>
        }
      </Paper>

      <EventModal
        open={modalOpen}
        event={editEvent}
        defaultDate={defaultDate}
        onClose={closeEdit}
        onSaved={refresh}
      />
      <DeleteConfirmDialog
        event={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </Box>
  )
}
