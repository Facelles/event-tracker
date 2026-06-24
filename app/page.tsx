import { redirect } from 'next/navigation'
import { auth } from '@/src/auth'

export default async function HomePage() {
  const session = await auth()

  if (session?.user) {
    redirect('/event-calendar')
  } else {
    redirect('/login')
  }
}
