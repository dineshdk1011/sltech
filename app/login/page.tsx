import type { Metadata } from 'next'
import EngineerLogin from '@/components/EngineerLogin'

// Auth-gated utility page: must never be indexed. Without this it inherits the
// root layout's `canonical: "/"`, which points a private URL at the homepage.
export const metadata: Metadata = {
  title: 'Engineer Login',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <EngineerLogin />
}