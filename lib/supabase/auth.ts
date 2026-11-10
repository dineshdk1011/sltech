import { cache } from 'react'
import type { AllowedUserRecord, CurrentUserSnapshot } from '@/lib/types'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

const getAuthData = cache(async () => {
  if (!isSupabaseConfigured()) {
    return {
      supabase: null,
      authUser: null,
      allowedUser: null,
      allowedUserError: false,
      email: '',
    }
  }

  const supabase = await createClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  const email = authUser?.email?.trim().toLowerCase() ?? ''

  let allowedUser: AllowedUserRecord | null = null
  let allowedUserError = false

  if (email) {
    const { data, error } = await supabase
      .from('allowed_users')
      .select('id, email, name, is_active')
      .ilike('email', email)
      .limit(1)
      .maybeSingle()

    allowedUser = data as AllowedUserRecord | null
    allowedUserError = Boolean(error)
  }

  return { supabase, authUser, allowedUser, allowedUserError, email }
})

function isActiveUser(user: AllowedUserRecord | null): boolean {
  return (
    user?.is_active === true ||
    String(user?.is_active).toLowerCase() === 'true'
  )
}

export async function getCurrentUserSnapshot(): Promise<CurrentUserSnapshot> {
  const { authUser, allowedUser, allowedUserError, email } = await getAuthData()
  const isActive = !allowedUserError && isActiveUser(allowedUser)

  return {
    authUser,
    allowedUser,
    allowedUserId: isActive ? allowedUser?.id ?? null : null,
    name: isActive ? String(allowedUser?.name || email) : '',
    email,
    loading: false,
    allowedUserError,
  }
}

export async function getEngineer() {
  const { supabase, authUser, allowedUser, allowedUserError, email } =
    await getAuthData()
  const isAuthorized = Boolean(
    authUser && allowedUser && !allowedUserError && isActiveUser(allowedUser),
  )

  return {
    supabase,
    user: isAuthorized ? authUser : null,
    engineerName: isAuthorized ? String(allowedUser?.name || email) : '',
  }
}