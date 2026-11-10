import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import {
  getSupabaseConfig,
  SUPABASE_ENV_ERROR_MESSAGE,
} from '@/lib/supabase/config'

export async function createClient() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(SUPABASE_ENV_ERROR_MESSAGE)
  }

  const cookieStore = await cookies()

  return createServerClient(
    config.url,
    config.publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component may not be able to set cookies.
          }
        },
      },
    }
  )
}