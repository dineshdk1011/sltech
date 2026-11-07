'use client'

import { useState, type ReactNode } from 'react'
import {
  Briefcase,
  CalendarDays,
  Clock,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'

import { getResumeSignedUrl } from '@/lib/careers'

import CareersModal from './CareersModal'
import type { JobApplication } from './types'
import { secondaryButtonClass } from './styles'
import { formatBytes, formatDateTime } from './utils'

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof User
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-[#F9FCFF] px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FD] text-[#002B8B]">
        <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
        <div className="mt-0.5 text-sm font-medium text-slate-800">{children}</div>
      </div>
    </div>
  )
}

export default function ApplicationDetails({
  open,
  application,
  onClose,
}: {
  open: boolean
  application: JobApplication | null
  onClose: () => void
}) {
  const [isPreparing, setIsPreparing] = useState(false)
  const [error, setError] = useState('')

  const openResume = async (download: boolean) => {
    if (!application?.resume_path || isPreparing) return

    setIsPreparing(true)
    setError('')

    try {
      const url = await getResumeSignedUrl(
        application.resume_path,
        download ? application.resume_filename ?? 'resume' : null,
      )

      if (download) {
        const link = document.createElement('a')
        link.href = url
        link.download = application.resume_filename ?? 'resume'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch (resumeError) {
      setError(
        resumeError instanceof Error
          ? resumeError.message
          : 'Could not open this resume. Please try again.',
      )
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <CareersModal
      open={open}
      onClose={onClose}
      title={application ? application.full_name : 'Application'}
      description={application ? `Applied for ${application.position}` : undefined}
      footer={
        application && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <FileText className="h-4 w-4 shrink-0 text-[#1268D8]" aria-hidden="true" />
              <span className="min-w-0 truncate">
                {application.resume_filename || 'Resume'}
                {application.resume_size ? ` · ${formatBytes(application.resume_size)}` : ''}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void openResume(false)}
                disabled={isPreparing}
                className={`${secondaryButtonClass} w-full sm:w-auto`}
              >
                {isPreparing ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ExternalLink className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                )}
                View resume
              </button>

              <button
                type="button"
                onClick={() => void openResume(true)}
                disabled={isPreparing}
                className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] px-5 text-[13px] font-semibold text-white shadow-[0_7px_20px_rgba(0,43,139,0.24)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Download className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                Download
              </button>
            </div>
          </div>
        )
      }
    >
      {application && (
        <div className="space-y-6">
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow icon={Mail} label="Email">
              <a
                href={`mailto:${application.email}`}
                className="break-all text-[#0753B8] hover:underline"
              >
                {application.email}
              </a>
            </DetailRow>

            <DetailRow icon={Phone} label="Phone">
              <a href={`tel:${application.phone}`} className="text-[#0753B8] hover:underline">
                {application.phone}
              </a>
            </DetailRow>

            <DetailRow icon={Briefcase} label="Position">
              {application.position}
            </DetailRow>

            <DetailRow icon={MapPin} label="Current location">
              {application.current_location || '—'}
            </DetailRow>

            <DetailRow icon={Clock} label="Experience">
              {application.years_of_experience || '—'}
            </DetailRow>

            <DetailRow icon={CalendarDays} label="Applied on">
              {formatDateTime(application.created_at)}
            </DetailRow>
          </div>

          {application.job_title && application.job_title !== application.position && (
            <p className="text-xs text-slate-500">
              Linked opening: <span className="font-semibold text-slate-700">{application.job_title}</span>
            </p>
          )}

          <div>
            <h3 className="text-gradient-brand text-sm font-bold">Cover letter / About</h3>
            <p className="mt-2 whitespace-pre-line rounded-xl border border-slate-100 bg-[#F9FCFF] px-4 py-3 text-sm leading-6 text-slate-600">
              {application.cover_letter || 'No cover letter provided.'}
            </p>
          </div>
        </div>
      )}
    </CareersModal>
  )
}