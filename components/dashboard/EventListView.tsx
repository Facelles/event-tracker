'use client'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Typography, Box } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import type { SerializedEvent } from '@/src/types/events'
import { IMPORTANCE_LABELS, IMPORTANCE_CHIP_COLOR } from '@/src/types/events'

interface Props {
  events: SerializedEvent[]
  onEdit: (event: SerializedEvent) => void
  onDelete: (event: SerializedEvent) => void
}

export default function EventListView({ events, onEdit, onDelete }: Props) {
  if (events.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary">No events found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Add your first event using the button above.</Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table id="events-table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Importance</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map(ev => (
            <TableRow key={ev.id} hover sx={{ '&:last-child td': { border: 0 }, cursor: 'pointer' }}>
              <TableCell sx={{ fontWeight: 600 }}>{ev.title}</TableCell>
              <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {new Date(ev.dateTime).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
              </TableCell>
              <TableCell>
                <Chip
                  label={IMPORTANCE_LABELS[ev.importance]}
                  color={IMPORTANCE_CHIP_COLOR[ev.importance]}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell sx={{ color: 'text.secondary', maxWidth: 240 }}>
                <Typography variant="body2" noWrap>{ev.description ?? '—'}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                <IconButton size="small" onClick={() => onEdit(ev)} aria-label="edit event"><Edit fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => onDelete(ev)} aria-label="delete event" color="error"><Delete fontSize="small" /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
