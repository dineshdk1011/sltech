export const SUPABASE_ENV_ERROR_MESSAGE =
  'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local.'

export interface SupabaseConfig {
  url: string
  publishableKey: string
}

export function getSupabaseConfig(): SupabaseConfig | null {
  // Direct property access ensures Next.js inlines NEXT_PUBLIC_* values into client bundles.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()

  if (!url || !publishableKey) {
    return null
  }

  return { url, publishableKey }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null
}
