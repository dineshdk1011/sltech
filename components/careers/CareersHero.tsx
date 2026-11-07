'use client'

import Image from 'next/image'
import { ArrowRight, Briefcase, MapPin, Upload } from 'lucide-react'

import { eyebrowClass, primaryButtonClass, secondaryButtonClass } from './styles'

const highlights = [
  'Hands-on training',
  'Pan-India opportunities',
  'Supportive team culture',
]

export default function CareersHero({ onSubmitResume }: { onSubmitResume: () => void }) {
  return (
    <section
      aria-labelledby="careers-hero-heading"
      className="relative isolate overflow-hidden rounded-3xl bg-white px-5 py-9 sm:px-8 sm:py-10 md:py-12 lg:px-12 lg:py-14"
    >
      {/* Subtle geometric / diagonal accents — no new colours introduced. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(18,104,216,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(18,104,216,0.045)_1px,transparent_1px)] [background-size:34px_34px]" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#EAF4FD] blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#F2F7FF] blur-3xl" />
        <div className="absolute right-0 top-1/2 hidden h-px w-1/3 -translate-y-1/2 rotate-[-24deg] bg-gradient-to-r from-transparent via-[#1268D8]/25 to-transparent lg:block" />
        <div className="absolute right-16 top-1/3 hidden h-px w-40 rotate-[-24deg] bg-gradient-to-r from-transparent via-[#002B8B]/20 to-transparent lg:block" />
        <div className="absolute -right-10 bottom-10 hidden h-24 w-24 rotate-12 rounded-2xl border border-[#DCEBFA] lg:block" />
      </div>

      <div className="relative grid min-w-0 items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div>
          <p className={eyebrowClass}>
            <Briefcase className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            Careers at SL Laundry Tech
          </p>

          <h1
            id="careers-hero-heading"
            className="text-gradient-brand mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[0.01em] md:text-5xl"
          >
            Build Your Career With SL Laundry Tech
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
            Join a growing commercial laundry technology and service company. We help
            businesses across India install, maintain and depend on the laundry equipment
            that keeps them running — and we are building a team that grows with us.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#open-positions" className={primaryButtonClass}>
              View Open Positions
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                strokeWidth={2}
                aria-hidden="true"
              />
            </a>

            <button type="button" onClick={onSubmitResume} className={secondaryButtonClass}>
              <Upload className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
              Submit Your Resume
            </button>
          </div>

          <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm font-medium text-slate-600 sm:grid-cols-2">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#EAF4FD] text-[11px] font-bold text-[#1268D8]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full min-w-0 max-w-[460px] lg:max-w-none">
          {/* <div className="relative overflow-hidden rounded-3xl border border-[#DCEBFA] bg-[#F4F7FC] shadow-[0_22px_55px_rgba(0,43,139,0.16)]">
            <div className="relative h-[260px] w-full sm:h-[320px] lg:h-[360px]">
              <Image
                src="/Careers.png"
                alt="SL Laundry Tech service engineer working on commercial laundry equipment"
                title="Careers at SL Laundry Tech"
                fill
                preload
                sizes="(max-width: 1024px) 90vw, 460px"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#002B8B]/35 via-transparent to-transparent"
              />
            </div>
          </div> */}
          <div className="relative flex h-[260px] w-full items-center justify-center overflow-hidden rounded-3xl border border-[#DCEBFA] bg-gradient-to-br from-white via-[#F7FAFE] to-[#EAF4FD] shadow-[0_22px_55px_rgba(0,43,139,0.10)] sm:h-[320px] lg:h-[360px]">
            <div className="relative z-10 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#5B8CC5] sm:text-sm">
                SL Laundry Tech
              </p>

              <h2 className="text-gradient-brand mt-3 text-5xl font-light tracking-[0.16em] sm:text-6xl lg:text-7xl">
                CAREERS
              </h2>

              <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-[#002B8B]/20 via-[#1268D8]/60 to-[#1268D8]/20" />

              <p className="mt-4 text-sm font-normal tracking-[0.08em] text-slate-500 sm:text-base">
                Build. Learn. Grow.
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 left-3 flex items-center gap-3 rounded-2xl border border-[#DCEBFA] bg-white/95 px-4 py-3 shadow-[0_16px_40px_rgba(0,43,139,0.16)] backdrop-blur sm:left-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4FD] text-[#002B8B]">
              <MapPin className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
            </span>
            <div>
              <p className="text-gradient-brand text-sm font-bold">Field &amp; project roles</p>
              <p className="text-xs text-slate-500">Tamil Nadu, Kerala &amp; beyond</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}