'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Box, Button, CircularProgress, Alert, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material'
import Link from 'next/link'
import { registerUser } from '@/src/actions/events'

export default function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await registerUser({ name, email, password })
    if (!res.success) { setError(res.error); setLoading(false); return }
    const signInRes = await signIn('credentials', { email, password, redirect: false })
    if (signInRes?.ok) { router.push('/event-calendar'); router.refresh() }
    else router.push('/login')
    setLoading(false)
  }

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 0.5 }}>Create your account</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>Start planning your events today</Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="reg-name" label="Full Name" fullWidth
          value={name} onChange={e => setName(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> } }}
        />
        <TextField
          id="reg-email" label="Email" type="email" fullWidth required
          value={email} onChange={e => setEmail(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> } }}
        />
        <TextField
          id="reg-password" label="Password" type={showPass ? 'text' : 'password'} fullWidth required
          value={password} onChange={e => setPassword(e.target.value)}
          helperText="At least 8 characters"
          slotProps={{ input: {
            startAdornment: <InputAdornment position="start"><Lock sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass(p => !p)} edge="end" size="small">
                  {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}}
        />

        <Button id="reg-submit" type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ py: 1.5 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Create Account'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
        Already have an account?{' '}
        <Link href="/login" style={{ color: '#9B94FF', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
      </Typography>
    </>
  )
}
