'use client'

import { Briefcase, CalendarDays, CheckCircle2, Clock, MapPin, Users } from 'lucide-react'

import CareersModal from './CareersModal'
import { primaryButtonClass } from './styles'
import { formatDateTime } from './utils'

export type PublishedJobSummary = {
  title: string
  department: string | null
  location: string | null
  employment_type: string | null
  experience: string | null
  short_description: string | null
  published_at: string
}

export default function PublishSuccessDialog({
  job,
  onClose,
}: {
  job: PublishedJobSummary | null
  onClose: () => void
}) {
  const details = job
    ? [
        { label: 'Department', value: job.department, icon: Users },
        { label: 'Location', value: job.location, icon: MapPin },
        { label: 'Employment type', value: job.employment_type, icon: Clock },
        { label: 'Experience', value: job.experience, icon: Briefcase },
        { label: 'Published on', value: formatDateTime(job.published_at), icon: CalendarDays },
      ].filter((item) => item.value && item.value.trim().length > 0)
    : []

  return (
    <CareersModal
      open={Boolean(job)}
      onClose={onClose}
      title="Job published successfully"
      size="md"
      footer={
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className={`${primaryButtonClass} w-full sm:w-auto`}>
            Done
          </button>
        </div>
      }
    >
      {job && (
        <div role="status" aria-live="polite">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.9} aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This opening is now live on the Careers page and open for applications.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-[#DCEBFA] bg-[#F9FCFF] p-4">
            <h3 className="text-gradient-brand text-base font-extrabold">{job.title}</h3>

            {job.short_description && (
              <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-600">
                {job.short_description}
              </p>
            )}

            {details.length > 0 && (
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {details.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FD] text-[#0753B8]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                        {label}
                      </dt>
                      <dd className="text-sm font-medium text-slate-800">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      )}
    </CareersModal>
  )
}
