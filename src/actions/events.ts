'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'
import { Importance, Prisma } from '@prisma/client'
import { EventSchema } from '@/src/lib/validations/event'
import type { CreateEventDTO, UpdateEventDTO } from '@/src/types/events'

type ActionResponse<T = void> = T extends void
  ? { success: true } | { success: false; error: string }
  : { success: true; data: T } | { success: false; error: string }

function withAuth<T, Args extends any[]>(
  actionName: string,
  handler: (userId: string, ...args: Args) => Promise<T>
): (...args: Args) => Promise<ActionResponse<T>> {
  return async (...args: Args) => {
    try {
      const session = await auth()
      if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized: you must be signed in to perform this action.' } as ActionResponse<T>
      }

      const data = await handler(session.user.id, ...args)
      return (data === undefined ? { success: true } : { success: true, data }) as ActionResponse<T>
    } catch (error) {
      console.error(`[${actionName}]`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to execute ${actionName}.`,
      } as ActionResponse<T>
    }
  }
}

// Fetch all events for the user with optional filters
export const getEvents = withAuth('getEvents', async (userId, search?: string, importance?: string) => {
  return prisma.event.findMany({
    where: {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(importance && importance !== 'ALL' && {
        importance: importance as Importance,
      }),
    },
    orderBy: { dateTime: 'asc' },
  })
})

// Create a new event
export const createEvent = withAuth('createEvent', async (userId, data: CreateEventDTO) => {
  const parsed = EventSchema.safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  await prisma.event.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description || null,
      dateTime: parsed.data.dateTime,
      importance: parsed.data.importance,
      userId,
    },
  })

  revalidatePath('/event-calendar')
})

// Update an existing event
export const updateEvent = withAuth('updateEvent', async (userId, id: string, data: UpdateEventDTO) => {
  const existing = await prisma.event.findFirst({ where: { id, userId }, select: { id: true } })
  if (!existing) throw new Error('Event not found or you do not have permission to update it.')

  const parsed = EventSchema.partial().safeParse(data)
  if (!parsed.success) throw new Error(parsed.error.issues[0].message)

  await prisma.event.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath('/event-calendar')
})

// Delete an event
export const deleteEvent = withAuth('deleteEvent', async (userId, id: string) => {
  const existing = await prisma.event.findFirst({ where: { id, userId }, select: { id: true } })
  if (!existing) throw new Error('Event not found or you do not have permission to delete it.')

  await prisma.event.delete({ where: { id } })

  revalidatePath('/event-calendar')
})

// Register a new user (No withAuth needed since it's a public route)
export async function registerUser(data: {
  name: string
  email: string
  password: string
}): Promise<ActionResponse> {
  try {
    const bcrypt = await import('bcryptjs')

    if (!data.email?.trim() || !data.password) throw new Error('Email and password are required.')
    if (data.password.length < 8) throw new Error('Password must be at least 8 characters.')

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    })

    if (existing) throw new Error('An account with this email already exists.')

    const passwordHash = await bcrypt.hash(data.password, 12)

    await prisma.user.create({
      data: {
        name: data.name?.trim() || null,
        email: data.email.toLowerCase().trim(),
        passwordHash,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('[registerUser]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user.',
    }
  }
}
