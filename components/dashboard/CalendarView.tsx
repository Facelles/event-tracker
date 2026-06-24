'use client'

import { useState, useMemo } from 'react'
import { Box, Typography, IconButton, Chip, Tooltip, alpha } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import type { SerializedEvent } from '@/src/types/events'
import { IMPORTANCE_COLORS, IMPORTANCE_LABELS } from '@/src/types/events'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

interface Props {
  events: SerializedEvent[]
  onEdit: (event: SerializedEvent) => void
  onAddDay?: (date: string) => void
}

export default function CalendarView({ events, onEdit, onAddDay }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  // Memoize calendar grid generation
  const { cells, eventsByDay, rows } = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7
    const totalDays = lastDay.getDate()

    const eventMap = new Map<string, SerializedEvent[]>()
    for (const ev of events) {
      const d = new Date(ev.dateTime)
      if (d.getFullYear() === year && d.getMonth() === month) {
        const key = d.getDate().toString()
        if (!eventMap.has(key)) eventMap.set(key, [])
        eventMap.get(key)!.push(ev)
      }
    }

    const gridCells: (number | null)[] = [
      ...Array(startOffset).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ]
    while (gridCells.length % 7 !== 0) gridCells.push(null)

    return {
      cells: gridCells,
      eventsByDay: eventMap,
      rows: gridCells.length / 7
    }
  }, [events, year, month])

  const checkIsToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const handleDayClick = (day: number | null) => {
    if (!day || !onAddDay) return
    const d = new Date(year, month, day)
    const pad = (n: number) => String(n).padStart(2, '0')
    onAddDay(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={prevMonth} size="small"><ChevronLeft /></IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
          {MONTHS[month]} {year}
        </Typography>
        <IconButton onClick={nextMonth} size="small"><ChevronRight /></IconButton>
      </Box>

      {/* Days of Week Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {DAYS.map(d => (
          <Typography key={d} variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 600, pb: 0.5 }}>
            {d}
          </Typography>
        ))}
      </Box>

      {/* Calendar Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`, gap: 1, flex: 1, minHeight: 0 }}>
        {cells.map((day, i) => (
          <CalendarCell 
            key={i} 
            day={day} 
            isToday={day ? checkIsToday(day) : false} 
            events={day ? (eventsByDay.get(day.toString()) ?? []) : []}
            onClick={() => handleDayClick(day)}
            onEditEvent={onEdit}
          />
        ))}
      </Box>
    </Box>
  )
}

// ---------------------------------------------------------------------------
// Extracted Sub-Components for Readability
// ---------------------------------------------------------------------------

interface CalendarCellProps {
  day: number | null
  isToday: boolean
  events: SerializedEvent[]
  onClick: () => void
  onEditEvent: (event: SerializedEvent) => void
}

function CalendarCell({ day, isToday, events, onClick, onEditEvent }: CalendarCellProps) {
  if (!day) {
    return <Box sx={{ opacity: 0 }} /> // Empty placeholder for padding
  }

  return (
    <Box
      onClick={onClick}
      sx={{
        p: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: isToday ? (theme) => alpha(theme.palette.primary.main, 0.5) : (theme) => alpha(theme.palette.primary.main, 0.05),
        background: isToday ? (theme) => `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, rgba(26,26,46,0) 100%)` : 'rgba(255,255,255,.01)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: isToday ? (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
        '&:hover': {
          background: (theme) => alpha(theme.palette.primary.main, 0.08),
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
          transform: 'scale(1.01)',
          boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{ 
          fontWeight: isToday ? 700 : 400, 
          color: isToday ? 'primary.light' : 'text.secondary', 
          display: 'block', 
          mb: 0.5 
        }}
      >
        {day}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', flex: 1, pr: 0.5 }}>
        {events.map(ev => (
          <EventChip key={ev.id} event={ev} onEdit={onEditEvent} />
        ))}
      </Box>
    </Box>
  )
}

function EventChip({ event, onEdit }: { event: SerializedEvent, onEdit: (e: SerializedEvent) => void }) {
  const color = IMPORTANCE_COLORS[event.importance]
  const label = IMPORTANCE_LABELS[event.importance]

  return (
    <Tooltip title={`${event.title} — ${label}`} placement="right">
      <Chip
        label={event.title}
        size="small"
        onClick={(e) => {
          e.stopPropagation() // Prevent triggering the cell's onClick
          onEdit(event)
        }}
        sx={{
          height: 22,
          fontSize: '0.65rem',
          fontWeight: 600,
          maxWidth: '100%',
          background: `${color}22`,
          border: `1px solid ${color}55`,
          color: color,
          cursor: 'pointer',
          justifyContent: 'flex-start',
          transition: 'all 0.2s',
          '& .MuiChip-label': { px: 1 },
          '&:hover': {
            background: `${color}44`,
            transform: 'translateX(2px)'
          }
        }}
      />
    </Tooltip>
  )
}
