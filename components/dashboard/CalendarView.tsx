'use client'

import { useState } from 'react'
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

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const totalDays = lastDay.getDate()

  const eventsByDay = new Map<string, SerializedEvent[]>()
  for (const ev of events) {
    const d = new Date(ev.dateTime)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate().toString()
      if (!eventsByDay.has(key)) eventsByDay.set(key, [])
      eventsByDay.get(key)!.push(ev)
    }
  }

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const rows = cells.length / 7

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={prevMonth} size="small"><ChevronLeft /></IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
          {MONTHS[month]} {year}
        </Typography>
        <IconButton onClick={nextMonth} size="small"><ChevronRight /></IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {DAYS.map(d => (
          <Typography key={d} variant="caption" sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 600, pb: 0.5 }}>
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`, gap: 1, flex: 1, minHeight: 0 }}>
        {cells.map((day, i) => {
          const dayEvents = day ? (eventsByDay.get(day.toString()) ?? []) : []
          return (
            <Box
              key={i}
              onClick={() => {
                if (day && onAddDay) {
                  const d = new Date(year, month, day)
                  const pad = (n: number) => String(n).padStart(2, '0')
                  onAddDay(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`)
                }
              }}
              sx={{
                p: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: day && isToday(day) ? (theme) => alpha(theme.palette.primary.main, 0.5) : day ? (theme) => alpha(theme.palette.primary.main, 0.05) : 'transparent',
                background: day && isToday(day) ? (theme) => `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, rgba(26,26,46,0) 100%)` : day ? 'rgba(255,255,255,.01)' : 'transparent',
                opacity: day ? 1 : 0,
                cursor: day && onAddDay ? 'pointer' : 'default',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: day && isToday(day) ? (theme) => `0 0 20px ${alpha(theme.palette.primary.main, 0.1)}` : 'none',
                '&:hover': day ? {
                  background: (theme) => alpha(theme.palette.primary.main, 0.08),
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                  transform: 'scale(1.01)',
                  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                } : {},
              }}
            >
              {day && (
                <>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: isToday(day) ? 700 : 400, color: isToday(day) ? 'primary.light' : 'text.secondary', display: 'block', mb: 0.5 }}
                  >
                    {day}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto', flex: 1, pr: 0.5 }}>
                    {dayEvents.map(ev => (
                      <Tooltip key={ev.id} title={`${ev.title} — ${IMPORTANCE_LABELS[ev.importance]}`} placement="right">
                        <Chip
                          label={ev.title}
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(ev)
                          }}
                          sx={{
                            height: 22,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            maxWidth: '100%',
                            background: IMPORTANCE_COLORS[ev.importance] + '22',
                            border: `1px solid ${IMPORTANCE_COLORS[ev.importance]}55`,
                            color: IMPORTANCE_COLORS[ev.importance],
                            cursor: 'pointer',
                            justifyContent: 'flex-start',
                            transition: 'all 0.2s',
                            '& .MuiChip-label': { px: 1 },
                            '&:hover': {
                              background: IMPORTANCE_COLORS[ev.importance] + '44',
                              transform: 'translateX(2px)'
                            }
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
