'use client'

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import type { SerializedEvent } from '@/src/types/events'

interface Props {
  event: SerializedEvent | null
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export default function DeleteConfirmDialog({ event, onClose, onConfirm, loading }: Props) {
  return (
    <Dialog open={!!event} onClose={onClose} maxWidth="xs" fullWidth id="delete-confirm-dialog">
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete <strong>{event?.title}</strong>? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button id="delete-cancel" onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
        <Button id="delete-confirm" onClick={onConfirm} variant="contained" color="error" disabled={loading}>
          {loading ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
