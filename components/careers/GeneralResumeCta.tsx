'use client'

import { FileText, Upload } from 'lucide-react'

import { primaryButtonClass, secondaryButtonClass } from './styles'

export default function GeneralResumeCta({
  onSubmitResume,
  onViewPositions,
}: {
  onSubmitResume: () => void
  onViewPositions: () => void
}) {
  return (
    <section aria-labelledby="careers-general-heading" className="pt-14 md:pt-16">
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#002B8B] px-6 py-9 md:px-12 md:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#1268D8]/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#0753B8]/40 blur-3xl" />
          <div className="absolute right-10 top-1/2 hidden h-px w-52 rotate-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent lg:block" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 sm:flex">
              <FileText className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
            </span>

            <div>
              <h2
                id="careers-general-heading"
                className="text-2xl font-extrabold text-white md:text-3xl"
              >
                Don&apos;t See the Right Position?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 md:text-base">
                Send us your resume and we&apos;ll keep you in mind for future opportunities.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onSubmitResume}
              className="group inline-flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-white px-5 text-[13px] font-bold text-[#002B8B] shadow-[0_7px_20px_rgba(0,0,0,0.18)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#002B8B] active:translate-y-0 active:scale-[0.98] xl:text-sm"
            >
              <Upload className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Submit Resume
            </button>

            <button
              type="button"
              onClick={onViewPositions}
              className={primaryButtonClass}
            >
              Browse Openings
            </button>

          </div>
        </div>
      </div>
    </section>
  )
}