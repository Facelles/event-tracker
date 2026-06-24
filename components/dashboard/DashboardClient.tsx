'use client'

import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material'
import { signOut } from 'next-auth/react'
import TopToolbar from '@/components/dashboard/TopToolbar'
import CalendarView from '@/components/dashboard/CalendarView'
import EventListView from '@/components/dashboard/EventListView'
import EventModal from '@/components/dashboard/EventModal'
import DeleteConfirmDialog from '@/components/dashboard/DeleteConfirmDialog'
import type { SerializedEvent } from '@/src/types/events'
import { useDashboard } from './useDashboard'

interface Props {
  initialEvents: SerializedEvent[]
  userName: string
}

export default function DashboardClient({ initialEvents, userName }: Props) {
  const { state, actions } = useDashboard(initialEvents)

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', px: { xs: 2, md: 4 }, py: 3, overflow: 'hidden' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, background: (theme) => theme.palette.gradients.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
        search={state.search} importance={state.importance} view={state.view}
        onSearch={actions.setSearch} onImportance={actions.setImportance} onView={actions.setView}
        onAdd={actions.openCreate}
      />

      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {state.isPending && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,15,26,.6)', borderRadius: 3, zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}

        {state.view === 'calendar'
          ? <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}><CalendarView events={state.filteredEvents} onEdit={actions.openEdit} onAddDay={actions.openCreate} /></Box>
          : <Box sx={{ flex: 1, overflow: 'auto' }}><EventListView events={state.filteredEvents} onEdit={actions.openEdit} onDelete={actions.setDeleteTarget} /></Box>
        }
      </Paper>

      <EventModal
        open={state.modalOpen}
        event={state.editEvent}
        defaultDate={state.defaultDate}
        onClose={actions.closeEdit}
        onSaved={actions.refresh}
      />
      <DeleteConfirmDialog
        event={state.deleteTarget}
        onClose={() => actions.setDeleteTarget(null)}
        onConfirm={actions.handleDelete}
        loading={state.deleting}
      />
    </Box>
  )
}
