'use client'

import { AlertCircle, Briefcase, FileText, RefreshCw, SearchX } from 'lucide-react'

import JobOpeningCard from './JobOpeningCard'
import type { JobOpening } from './types'
import { primaryButtonClass, secondaryButtonClass, sectionLabelClass } from './styles'

function OpeningSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(15,43,77,0.04)]">
      <div className="h-5 w-28 rounded-full bg-slate-100" />
      <div className="mt-4 h-6 w-3/4 rounded-md bg-slate-100" />
      <div className="mt-3 h-4 w-1/2 rounded-md bg-slate-100" />
      <div className="mt-5 space-y-2">
        <div className="h-4 w-full rounded-md bg-slate-100" />
        <div className="h-4 w-5/6 rounded-md bg-slate-100" />
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-7 w-20 rounded-full bg-slate-100" />
        <div className="h-7 w-24 rounded-full bg-slate-100" />
      </div>
      <div className="mt-7 h-11 w-full rounded-[13px] bg-slate-100" />
    </div>
  )
}

export default function JobOpeningsSection({
  openings,
  isLoading,
  errorMessage,
  setupRequired,
  onApply,
  onRetry,
  onSubmitResume,
}: {
  openings: JobOpening[]
  isLoading: boolean
  errorMessage: string
  setupRequired: boolean
  onApply: (opening: JobOpening) => void
  onRetry: () => void
  onSubmitResume: () => void
}) {
  return (
    <section id="open-positions" aria-labelledby="careers-openings-heading" className="pt-14 scroll-mt-24 md:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={sectionLabelClass}>Open Positions</p>
          <h2
            id="careers-openings-heading"
            className="text-gradient-brand mt-2 text-3xl font-extrabold tracking-tight md:text-4xl"
          >
            Current openings
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Explore the roles we are hiring for right now. Apply directly and our team will
            get back to you.
          </p>
        </div>

        {!isLoading && !errorMessage && openings.length > 0 && (
          <span className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#DCEBFA] bg-[#F2F7FF] px-3.5 py-2 text-xs font-bold text-[#0753B8]">
            <Briefcase className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            {openings.length} {openings.length === 1 ? 'opening' : 'openings'}
          </span>
        )}
      </div>

      {isLoading && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2" aria-live="polite" aria-busy="true">
          <OpeningSkeleton />
          <OpeningSkeleton />
          <OpeningSkeleton />
          <OpeningSkeleton />
          <span className="sr-only">Loading open positions…</span>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div
          role="alert"
          className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-amber-900">
                {setupRequired ? 'Openings are being set up' : 'We could not load the openings'}
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">{errorMessage}</p>
            </div>
          </div>

          {!setupRequired && (
            <button type="button" onClick={onRetry} className={`${secondaryButtonClass} shrink-0`}>
              <RefreshCw className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Try again
            </button>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && openings.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-slate-100 bg-[#F9FCFF] px-6 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4FD] text-[#002B8B]">
            <SearchX className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
          </span>
          <h3 className="text-gradient-brand mt-4 text-lg font-bold">
            There are no open positions right now
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            We are always interested in meeting good people. Send us your resume and we will
            reach out when a matching role opens up.
          </p>
          <button
            type="button"
            onClick={onSubmitResume}
            className={`${primaryButtonClass} mt-6`}
          >
            <FileText className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
            Submit Your Resume
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && openings.length > 0 && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {openings.map((opening) => (
            <JobOpeningCard key={opening.id} opening={opening} onApply={onApply} />
          ))}
        </div>
      )}
    </section>
  )
}