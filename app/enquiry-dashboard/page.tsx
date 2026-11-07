import type { Metadata } from 'next'
import EnquiryDashboard from '@/components/EnquiryDashboard'
import { getEngineer } from '@/lib/supabase/auth'
import { redirect } from 'next/navigation'

// Internal dashboard containing customer enquiry data — never indexable.
export const metadata: Metadata = {
  title: 'Enquiry Dashboard',
  robots: { index: false, follow: false },
}

export default async function EnquiriesPage() {
  const { user } = await getEngineer()
  if (!user) redirect('/login')
  return <EnquiryDashboard />
}