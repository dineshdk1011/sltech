'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import ServiceReportTable, {
  type ServiceReportRecord,
} from '@/components/enquiry-dashboard/ServiceReportTable'
import { useCurrentUser } from '@/components/UserContext'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/Loader'

// Only active service reports are ever shown. Soft-deleted rows
// (is_active = false) are filtered out at the query level.
async function fetchActiveServiceReports() {
  const { data, error } = await createClient()
    .from('service_reports')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []) as ServiceReportRecord[]
}

export default function ServiceReportPage() {
  const router = useRouter()
  const { authUser, allowedUserId, loading: userLoading } = useCurrentUser()
  const [reports, setReports] = useState<ServiceReportRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const isLocalDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isLocalDevelopment && (!authUser || !allowedUserId)) {
      router.replace('/login')
      return
    }

    let isActive = true

    const fetchReports = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const fetchedReports = await fetchActiveServiceReports()
        if (!isActive) return

        setReports(fetchedReports)
      } catch (error) {
        if (!isActive) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load service reports.',
        )
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void fetchReports()

    return () => {
      isActive = false
    }
  }, [authUser, allowedUserId, isLocalDevelopment, router])

  const handleDeleteReport = async (report: ServiceReportRecord) => {
    if (report.id == null) {
      setDeleteError('This service report has no valid id and cannot be deleted.')
      return
    }

    setDeleteError(null)

    try {
      const supabase = createClient()
      // Soft delete: never physically remove the row, just deactivate it.
      // `.eq('id', ...)` scopes the update to this single service report.
      const { error } = await supabase
        .from('service_reports')
        .update({ is_active: false })
        .eq('id', report.id)

      if (error) throw error
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while deleting the service report.'
      setDeleteError(`Could not delete service report: ${message}`)
      return
    }

    // Hide the row immediately so the table stays responsive.
    setReports((currentReports) =>
      currentReports.filter(
        (item) => String(item.id ?? '') !== String(report.id ?? ''),
      ),
    )

    // Refresh from the database so the list reflects is_active = true rows.
    try {
      const refreshedReports = await fetchActiveServiceReports()
      setReports(refreshedReports)
    } catch {
      setDeleteError(
        'Service report was deleted, but the list could not be refreshed. Reload the page to see the latest data.',
      )
    }
  }

  if (userLoading || isLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <Loader label="Loading service reports..." />
      </main>
    )
  }

  if (errorMessage) {
    return (
      <main className="px-4 py-12 text-center text-red-700" role="alert">
        Could not load service reports: {errorMessage}
      </main>
    )
  }

  return (
    <>
      {deleteError && (
        <div className="mx-auto max-w-6xl px-4 pt-4 text-center text-sm font-medium text-red-700" role="alert">
          {deleteError}
        </div>
      )}

      <ServiceReportTable reports={reports} onDelete={handleDeleteReport} />
    </>
  )
}