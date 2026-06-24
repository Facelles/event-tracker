import 'next-auth'
import { DefaultSession } from 'next-auth'

// Augment NextAuth Session type to expose user.id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
