import { Importance } from '@prisma/client'

export type { Importance }

/** Event as returned from the DB (Date objects) */
export interface EventDTO {
  id: string
  title: string
  description: string | null
  dateTime: Date
  importance: Importance
  userId: string
  createdAt: Date
  updatedAt: Date
}

/** Event serialized for passing server → client component */
export interface SerializedEvent {
  id: string
  title: string
  description: string | null
  dateTime: string   // ISO string
  importance: Importance
  userId: string
}

export interface CreateEventDTO {
  title: string
  description?: string
  dateTime: Date
  importance: Importance
}

export interface UpdateEventDTO {
  title?: string
  description?: string
  dateTime?: Date
  importance?: Importance
}

export type ViewMode = 'calendar' | 'list'

export const IMPORTANCE_LABELS: Record<Importance, string> = {
  REGULAR: 'Regular',
  IMPORTANT: 'Important',
  CRITICAL: 'Critical',
}

export const IMPORTANCE_COLORS = {
  REGULAR:  '#6C63FF',
  IMPORTANT: '#FFB347',
  CRITICAL:  '#FF4B4B',
} as const satisfies Record<Importance, string>

export const IMPORTANCE_CHIP_COLOR = {
  REGULAR:  'primary',
  IMPORTANT: 'warning',
  CRITICAL:  'error',
} as const satisfies Record<Importance, 'primary' | 'warning' | 'error'>
