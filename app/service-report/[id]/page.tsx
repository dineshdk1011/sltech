'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import ServiceReportView, {
  type ServiceReport,
} from '@/components/ServiceReportView'
import { createClient } from '@/lib/supabase/client'
import Loader from '@/components/Loader'

export default function ServiceReportDetailPage() {
  const params = useParams<{ id: string }>()
  const reportId = params?.id
  const [report, setReport] = useState<ServiceReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!reportId) return

    let isActive = true

    const fetchReport = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const supabase = createClient()
        const numericReportId = Number(reportId)
        // Soft-deleted reports (is_active = false) are treated as not found.
        const { data, error } = Number.isNaN(numericReportId)
          ? await supabase
              .from('service_reports')
              .select('*')
              .eq('id', reportId)
              .eq('is_active', true)
              .single()
          : await supabase
              .from('service_reports')
              .select('*')
              .eq('id', numericReportId)
              .eq('is_active', true)
              .single()

        if (error) throw error

        if (!isActive) return
        setReport(data as ServiceReport)
      } catch (error) {
        if (!isActive) return
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Could not load the selected service report.',
        )
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    void fetchReport()

    return () => {
      isActive = false
    }
  }, [reportId])

  if (!reportId) {
    return (
      <main className="px-4 py-12 text-center text-red-700" role="alert">
        No service report id was provided.
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center px-4 py-12">
        <Loader label="Loading service report..." />
      </main>
    )
  }

  if (errorMessage || !report) {
    return (
      <main className="px-4 py-12 text-center text-red-700" role="alert">
        {errorMessage || 'Could not load the selected service report.'}
      </main>
    )
  }

  return <ServiceReportView report={report} />
}