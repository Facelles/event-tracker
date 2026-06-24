'use client'

import { useState, useEffect } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Alert, CircularProgress } from '@mui/material'
import { Importance } from '@prisma/client'
import { EventSchema } from '@/src/lib/validations/event'
import type { SerializedEvent } from '@/src/types/events'
import { IMPORTANCE_LABELS } from '@/src/types/events'
import { createEvent, updateEvent } from '@/src/actions/events'

interface Props {
  open: boolean
  event: SerializedEvent | null
  defaultDate?: string
  onClose: () => void
  onSaved: () => void
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const BLANK: { title: string; description: string; dateTime: string; importance: Importance } = {
  title: '', description: '', dateTime: '', importance: Importance.REGULAR,
}

export default function EventModal({ open, event, defaultDate, onClose, onSaved }: Props) {
  const [form, setForm] = useState(BLANK)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description ?? '',
        dateTime: toDatetimeLocal(event.dateTime),
        importance: event.importance,
      })
    } else {
      setForm({
        ...BLANK,
        dateTime: defaultDate ? toDatetimeLocal(`${defaultDate}T12:00:00`) : '',
      })
    }
    setError('')
  }, [event, defaultDate, open])

  const set = (field: keyof typeof BLANK) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSave = async () => {
    setLoading(true)
    setError('')

    const parsed = EventSchema.safeParse(form)
    
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      setLoading(false)
      return
    }

    const res = event
      ? await updateEvent(event.id, parsed.data)
      : await createEvent(parsed.data)

    if (!res.success) setError(res.error)
    else { onSaved(); onClose() }
    setLoading(false)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth id="event-modal">
      <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>
        {event ? 'Edit Event' : 'New Event'}
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '20px !important' }}>
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

        <TextField
          id="event-title" label="Title" fullWidth required
          value={form.title} onChange={set('title')}
          autoFocus
        />

        <TextField
          id="event-datetime" label="Date & Time" type="datetime-local" fullWidth required
          value={form.dateTime} onChange={set('dateTime')}
          slotProps={{ 
            inputLabel: { shrink: true },
            htmlInput: { style: { colorScheme: 'dark' } }
          }}
        />

        <TextField
          id="event-importance" label="Importance" select fullWidth
          value={form.importance} onChange={set('importance')}
        >
          {Object.values(Importance).map(v => (
            <MenuItem key={v} value={v}>{IMPORTANCE_LABELS[v]}</MenuItem>
          ))}
        </TextField>

        <TextField
          id="event-description" label="Description" fullWidth multiline rows={3}
          value={form.description} onChange={set('description')}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button id="event-cancel" onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
        <Button id="event-save" onClick={handleSave} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={20} color="inherit" /> : event ? 'Save Changes' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
