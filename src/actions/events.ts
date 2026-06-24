'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/src/auth'
import { prisma } from '@/src/lib/prisma'
import { Importance, Prisma } from '@prisma/client'
import type { CreateEventDTO, UpdateEventDTO } from '@/src/types/events'

// Helper: Get authenticated user ID
async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error('Unauthorized: you must be signed in to perform this action.')
  }
  return session.user.id
}

// Fetch all events for the user with optional filters
export async function getEvents(
  search?: string,
  importance?: string
): Promise<{
  success: true
  data: Array<{
    id: string
    title: string
    description: string | null
    dateTime: Date
    importance: Importance
    userId: string
    createdAt: Date
    updatedAt: Date
  }>
} | { success: false; error: string }> {
  try {
    const userId = await getAuthenticatedUserId()

    const events = await prisma.event.findMany({
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

    return { success: true, data: events }
  } catch (error) {
    console.error('[getEvents]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events.',
    }
  }
}

// Create a new event
export async function createEvent(
  data: CreateEventDTO
  ): Promise<{ success: true } | { success: false; error: string }> {
    try {
      const userId = await getAuthenticatedUserId()
  
    if (!data.title?.trim()) {
      return { success: false, error: 'Title is required.' }
    }

    if (!data.dateTime) {
      return { success: false, error: 'Date and time are required.' }
    }

    await prisma.event.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        dateTime: data.dateTime,
        importance: data.importance ?? Importance.REGULAR,
        userId,
      },
    })

    revalidatePath('/event-calendar')
    return { success: true }
  } catch (error) {
    console.error('[createEvent]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event.',
    }
  }
}

// Update an existing event
export async function updateEvent(
  id: string,
  data: UpdateEventDTO
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userId = await getAuthenticatedUserId()

    // Verify ownership
    const existing = await prisma.event.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) {
      return {
        success: false,
        error: 'Event not found or you do not have permission to update it.',
      }
    }

    const updateData: Prisma.EventUpdateInput = {}
    if (data.title !== undefined) updateData.title = data.title.trim()
    if (data.description !== undefined) updateData.description = data.description.trim() || null
    if (data.dateTime !== undefined) updateData.dateTime = data.dateTime
    if (data.importance !== undefined) updateData.importance = data.importance

    await prisma.event.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/event-calendar')
    return { success: true }
  } catch (error) {
    console.error('[updateEvent]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update event.',
    }
  }
}

// Delete an event
export async function deleteEvent(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const userId = await getAuthenticatedUserId()

    // Verify ownership
    const existing = await prisma.event.findFirst({
      where: { id, userId },
      select: { id: true },
    })

    if (!existing) {
      return {
        success: false,
        error: 'Event not found or you do not have permission to delete it.',
      }
    }

    await prisma.event.delete({
      where: { id },
    })

    revalidatePath('/event-calendar')
    return { success: true }
  } catch (error) {
    console.error('[deleteEvent]', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event.',
    }
  }
}

// Register a new user
export async function registerUser(data: {
  name: string
  email: string
  password: string
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const bcrypt = await import('bcryptjs')

    if (!data.email?.trim() || !data.password) {
      return { success: false, error: 'Email and password are required.' }
    }

    if (data.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters.' }
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    })

    if (existing) {
      return { success: false, error: 'An account with this email already exists.' }
    }

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
