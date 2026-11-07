import type { Metadata } from 'next'
import EnquiryDashboard from '@/components/EnquiryDashboard'
import { getEngineer } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'

// Internal admin view of customer enquiries — never indexable.
export const metadata: Metadata = {
  title: 'Admin Enquiries',
  robots: { index: false, follow: false },
}

export default async function AdminEnquiriesPage() {
  const { user } = await getEngineer()
  if (!user) redirect('/login')
  return <EnquiryDashboard />
}