import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SerializedEvent, ViewMode } from '@/src/types/events'
import { deleteEvent } from '@/src/actions/events'

export function useDashboard(initialEvents: SerializedEvent[]) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [view, setView] = useState<ViewMode>('calendar')
  const [search, setSearch] = useState('')
  const [importance, setImportance] = useState('ALL')

  const [editEvent, setEditEvent] = useState<SerializedEvent | null>(null)
  const [defaultDate, setDefaultDate] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SerializedEvent | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredEvents = initialEvents.filter(ev => {
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || (ev.description ?? '').toLowerCase().includes(search.toLowerCase())
    const matchImportance = importance === 'ALL' || ev.importance === importance
    return matchSearch && matchImportance
  })

  const refresh = useCallback(() => {
    startTransition(() => router.refresh())
  }, [router])

  const openCreate = (date?: string) => { setEditEvent(null); setDefaultDate(date); setModalOpen(true) }
  const openEdit = (ev: SerializedEvent) => { setEditEvent(ev); setModalOpen(true) }
  const closeEdit = () => setModalOpen(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    await deleteEvent(deleteTarget.id)
    setDeleteTarget(null)
    setDeleting(false)
    refresh()
  }

  return {
    state: {
      view, search, importance, isPending, filteredEvents,
      modalOpen, editEvent, defaultDate,
      deleteTarget, deleting
    },
    actions: {
      setView, setSearch, setImportance,
      openCreate, openEdit, closeEdit,
      setDeleteTarget, handleDelete, refresh
    }
  }
}
