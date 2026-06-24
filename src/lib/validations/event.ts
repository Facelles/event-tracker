import { z } from 'zod'
import { Importance } from '@prisma/client'

export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  dateTime: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  importance: z.nativeEnum(Importance).default(Importance.REGULAR),
})

export type EventFormData = z.infer<typeof EventSchema>
