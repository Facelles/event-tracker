import { auth } from '@/src/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const { nextUrl, auth: session } = req

  const isAuthenticated = !!session?.user

  if (nextUrl.pathname.startsWith('/event-calendar') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthenticated && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/event-calendar', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/event-calendar/:path*', '/login', '/register'],
}
