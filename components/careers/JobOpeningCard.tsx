'use client'

import { useCallback, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react'

import CareersModal from './CareersModal'
import type { JobOpening } from './types'
import { chipClass, primaryButtonClass } from './styles'
import { jobMeta, parseList } from './utils'

export default function JobOpeningCard({
  opening,
  onApply,
}: {
  opening: JobOpening
  onApply: (opening: JobOpening) => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const closeDetails = useCallback(() => setDetailsOpen(false), [])

  const meta = jobMeta(opening)
  const skills = parseList(opening.requirements)
  const responsibilities = parseList(opening.responsibilities)
  const hasDetails = Boolean(
    opening.full_description || responsibilities.length || skills.length,
  )

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,43,77,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#CFE5FA] hover:shadow-[0_18px_40px_rgba(0,43,139,0.12)] sm:p-6">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {opening.department && (
            <p className={`${chipClass} max-w-full whitespace-normal break-words`}>
              <Building2 className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              {opening.department}
            </p>
          )}

          <h3 className="text-gradient-brand mt-3 break-words text-xl font-bold leading-snug">
            {opening.title}
          </h3>
        </div>

        {opening.employment_type && (
          <span className="inline-flex max-w-full items-center whitespace-normal rounded-full bg-[#002B8B]/5 px-3 py-1 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#002B8B]">
            {opening.employment_type}
          </span>
        )}
      </div>

      {meta.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
          {opening.location && (
            <li className="flex min-w-0 items-center gap-1.5 break-words">
              <MapPin className="h-4 w-4 text-[#1268D8]" strokeWidth={1.8} aria-hidden="true" />
              {opening.location}
            </li>
          )}
          {opening.experience && (
            <li className="flex min-w-0 items-center gap-1.5 break-words">
              <Clock className="h-4 w-4 text-[#1268D8]" strokeWidth={1.8} aria-hidden="true" />
              {opening.experience}
            </li>
          )}
        </ul>
      )}

      {opening.short_description && (
        <p className="mt-4 break-words text-sm leading-6 text-slate-600">{opening.short_description}</p>
      )}

      {skills.length > 0 && (
        <div className="mt-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-[#1268D8]" strokeWidth={2} aria-hidden="true" />
            Skills &amp; requirements
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill) => (
              <li
                key={skill}
                className="max-w-full break-words rounded-full border border-[#DCEBFA] bg-[#F2F7FF] px-3 py-1 text-xs font-medium text-[#0753B8]"
              >
                {skill}
              </li>
            ))}
            {skills.length > 5 && (
              <li className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                +{skills.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        {hasDetails ? (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`View Job Opening Details for ${opening.title}`}
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-sm font-semibold text-[#0753B8] transition-colors hover:text-[#002B8B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B]/30"
          >
            View Job Opening Details
          </button>
        ) : (
          <span aria-hidden="true" />
        )}

        <button
          type="button"
          onClick={() => onApply(opening)}
          className={`${primaryButtonClass} w-full sm:w-auto`}
        >
          Apply Now
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>

      <CareersModal
        open={detailsOpen}
        onClose={closeDetails}
        title={opening.title}
        description={opening.department || undefined}
      >
        <div className="flex flex-wrap gap-2">
          {opening.location && (
            <span className={chipClass}>
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {opening.location}
            </span>
          )}
          {opening.employment_type && (
            <span className={chipClass}>
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {opening.employment_type}
            </span>
          )}
          {opening.experience && (
            <span className={chipClass}>
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {opening.experience}
            </span>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {(opening.full_description || opening.short_description) && (
            <section>
              <h3 className="text-gradient-brand text-sm font-bold">Description</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                {opening.full_description || opening.short_description}
              </p>
            </section>
          )}

          {responsibilities.length > 0 && (
            <section>
              <h3 className="text-gradient-brand text-sm font-bold">Responsibilities</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {responsibilities.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1268D8]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h3 className="text-gradient-brand text-sm font-bold">Requirements</h3>
              <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {skills.map((item, index) => (
                  <li key={`${item}-req-${index}`} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1268D8]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-7 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={() => {
              closeDetails()
              onApply(opening)
            }}
            className={primaryButtonClass}
          >
            Apply
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </CareersModal>
    </article>
  )
}