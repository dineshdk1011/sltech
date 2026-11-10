import { createBrowserClient } from '@supabase/ssr'

import {
  getSupabaseConfig,
  SUPABASE_ENV_ERROR_MESSAGE,
} from '@/lib/supabase/config'

export function createClient() {
  const config = getSupabaseConfig()
  if (!config) {
    throw new Error(SUPABASE_ENV_ERROR_MESSAGE)
  }

  return createBrowserClient(config.url, config.publishableKey)
}