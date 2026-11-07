import type { Metadata } from 'next'

/**
 * Auth-gated service report area.
 *
 * The pages below are client components and therefore cannot export their own
 * `metadata`. Declaring it here covers `/service-report`, `/service-report/new`
 * and `/service-report/[id]` in one place and stops them inheriting the root
 * layout's `canonical: "/"`.
 */
export const metadata: Metadata = {
  title: 'Service Reports',
  robots: { index: false, follow: false },
}

export default function ServiceReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}