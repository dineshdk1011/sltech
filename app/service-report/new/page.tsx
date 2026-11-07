import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getEngineer } from '@/lib/supabase/auth'
import ServiceReportForm from '@/components/ServiceReportForm'

// Auth-gated service report form — never indexable.
export const metadata: Metadata = {
  title: 'New Service Report',
  robots: { index: false, follow: false },
}

export default async function ServiceReportPage() {
  const { user } = await getEngineer()
  if (!user) redirect('/login')

  return <ServiceReportForm />
}