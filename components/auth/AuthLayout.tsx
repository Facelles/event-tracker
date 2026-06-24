'use client'

import { Box, Card, CardContent, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

/** Shared dark background + centred card wrapper for auth pages */
export default function AuthLayout({
  children,
  accentDir = 'left',
}: {
  children: React.ReactNode
  accentDir?: 'left' | 'right'
}) {
  const bg =
    accentDir === 'left'
      ? 'radial-gradient(ellipse at top left, rgba(108,99,255,.15) 0%, #0F0F1A 50%)'
      : 'radial-gradient(ellipse at top right, rgba(255,101,132,.12) 0%, #0F0F1A 50%)'

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 440, backdropFilter: 'blur(20px)', background: 'rgba(26,26,46,.88)', border: '1px solid rgba(108,99,255,.2)' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #6C63FF, #9B94FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(108,99,255,.4)' }}>
              <CalendarMonthIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #6C63FF, #9B94FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EventFlow
            </Typography>
          </Box>

          {children}
        </CardContent>
      </Card>
    </Box>
  )
}
