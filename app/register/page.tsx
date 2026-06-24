import type { Metadata } from 'next'
import AuthLayout from '@/components/auth/AuthLayout'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Sign Up | EventFlow' }

export default function RegisterPage() {
  return (
    <AuthLayout accentDir="right">
      <RegisterForm />
    </AuthLayout>
  )
}
