import { NextRequest, NextResponse } from 'next/server'

import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = request.nextUrl.searchParams.get('next')
  const redirectPath = next?.startsWith('/') && !next.startsWith('//') ? next : '/'

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/login?error=oauth_config', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_callback', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Google OAuth callback failed:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_callback', request.url))
  }

  return NextResponse.redirect(new URL(redirectPath, request.url))
}