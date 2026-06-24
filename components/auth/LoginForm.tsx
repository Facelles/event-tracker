'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Box, Button, CircularProgress, Divider, Alert, TextField, Typography, IconButton, InputAdornment } from '@mui/material'
import { Email, Lock, Visibility, VisibilityOff, Google } from '@mui/icons-material'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) setError('Invalid email or password.')
    else { router.push('/event-calendar'); router.refresh() }
    setLoading(false)
  }

  return (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center', mb: 0.5 }}>Welcome back</Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mb: 3 }}>Sign in to manage your events</Typography>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="login-email" label="Email" type="email" fullWidth required
          value={email} onChange={e => setEmail(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> } }}
        />
        <TextField
          id="login-password" label="Password" type={showPass ? 'text' : 'password'} fullWidth required
          value={password} onChange={e => setPassword(e.target.value)}
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

        <Button id="login-submit" type="submit" variant="contained" color="primary" size="large" disabled={loading} sx={{ py: 1.5 }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }}><Typography variant="caption" color="text.secondary">or</Typography></Divider>

      <Button
        id="google-signin" variant="outlined" fullWidth size="large"
        startIcon={<Google />} disabled={gLoading}
        onClick={async () => { setGLoading(true); await signIn('google', { callbackUrl: '/event-calendar' }) }}
        sx={{ py: 1.5, borderColor: 'rgba(108,99,255,.3)', '&:hover': { borderColor: 'primary.main', background: 'rgba(108,99,255,.08)' } }}
      >
        {gLoading ? <CircularProgress size={22} color="inherit" /> : 'Continue with Google'}
      </Button>

      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 3 }}>
        Don&apos;t have an account?{' '}
        <Link href="/register" style={{ color: '#9B94FF', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
      </Typography>
    </>
  )
}
