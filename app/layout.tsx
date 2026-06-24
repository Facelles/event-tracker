import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import ThemeRegistry from './ThemeRegistry'
import { auth } from '@/src/auth'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'EventFlow — Personal Event Planner',
    template: '%s | EventFlow',
  },
  description:
    'A beautifully designed personal event planner with calendar and list views. Manage your schedule effortlessly.',
  keywords: ['event planner', 'calendar', 'schedule', 'productivity'],
  authors: [{ name: 'EventFlow' }],
  robots: 'index, follow',
  openGraph: {
    title: 'EventFlow — Personal Event Planner',
    description: 'Manage your personal events with a stunning calendar interface.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeRegistry>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}
