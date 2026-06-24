'use client'

import { Box, Button, TextField, Select, MenuItem, ToggleButtonGroup, ToggleButton, InputAdornment, FormControl, InputLabel } from '@mui/material'
import { Search, Add, CalendarMonth, ViewList } from '@mui/icons-material'
import { Importance } from '@prisma/client'
import type { ViewMode } from '@/src/types/events'

interface Props {
  search: string
  importance: Importance | 'ALL'
  view: ViewMode
  onSearch: (v: string) => void
  onImportance: (v: Importance | 'ALL') => void
  onView: (v: ViewMode) => void
  onAdd: () => void
}

export default function TopToolbar({ search, importance, view, onSearch, onImportance, onView, onAdd }: Props) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 3 }}>
      <TextField
        id="toolbar-search"
        placeholder="Search events…"
        size="small"
        value={search}
        onChange={e => onSearch(e.target.value)}
        sx={{ minWidth: 200, flex: 1 }}
        slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
      />

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="importance-label">Importance</InputLabel>
        <Select
          labelId="importance-label"
          id="toolbar-importance"
          value={importance}
          label="Importance"
          onChange={e => onImportance(e.target.value as Importance | 'ALL')}
        >
          <MenuItem value="ALL">All</MenuItem>
          <MenuItem value={Importance.REGULAR}>Regular</MenuItem>
          <MenuItem value={Importance.IMPORTANT}>Important</MenuItem>
          <MenuItem value={Importance.CRITICAL}>Critical</MenuItem>
        </Select>
      </FormControl>

      <ToggleButtonGroup
        id="toolbar-view"
        size="small"
        exclusive
        value={view}
        onChange={(_, v) => v && onView(v)}
        sx={{ border: '1px solid rgba(108,99,255,.25)', borderRadius: 2 }}
      >
        <ToggleButton value="calendar" aria-label="calendar view"><CalendarMonth fontSize="small" /></ToggleButton>
        <ToggleButton value="list" aria-label="list view"><ViewList fontSize="small" /></ToggleButton>
      </ToggleButtonGroup>

      <Button id="add-event-btn" variant="contained" color="primary" startIcon={<Add />} onClick={onAdd}>
        Add Event
      </Button>
    </Box>
  )
}
