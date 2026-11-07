'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import GoogleLoginButton from './GoogleLoginButton'
import { useCurrentUser } from './UserContext'

export default function EngineerLogin() {
  const router = useRouter()
  const { authUser } = useCurrentUser()

  useEffect(() => {
    if (authUser) router.replace('/')
  }, [authUser, router])

  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,43,77,0.08)]">
        <div className="mb-7 text-center">
          <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.18em]">Engineer access</p>
          <h1 className="text-gradient-brand mt-2 text-3xl font-extrabold tracking-tight">Sign in to continue</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Use your authorized SL Laundry Tech account.</p>
        </div>
        <GoogleLoginButton />
      </section>
    </main>
  )
}