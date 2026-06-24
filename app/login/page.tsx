import type { Metadata } from 'next'
import AuthLayout from '@/components/auth/AuthLayout'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Sign In | EventFlow' }

export default function LoginPage() {
  return (
    <AuthLayout accentDir="left">
      <LoginForm />
    </AuthLayout>
  )
}
