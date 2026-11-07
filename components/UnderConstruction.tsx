import { Construction } from 'lucide-react'

type UnderConstructionProps = {
  title: string
  description: string
}

export default function UnderConstruction({
  title,
  description,
}: UnderConstructionProps) {
  return (
    <main className="relative isolate flex min-h-[54vh] items-center overflow-hidden border-y border-[#DCEBFA] bg-gradient-to-br from-white via-[#F7FBFF] to-[#EAF4FD] px-5 py-16 sm:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(18,104,216,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(18,104,216,0.035)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <p className="text-gradient-brand flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em]">
            <span aria-hidden="true" className="h-px w-8 bg-[#1268D8]" />
            SL Laundry Tech
          </p>
          <h1 className="text-gradient-brand mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {description}
          </p>
          <p className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0753B8]">
            <Construction aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
            Under construction
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl border border-[#CFE5FA] bg-white text-[#1268D8] shadow-[0_16px_40px_rgba(0,43,139,0.10)] sm:h-40 sm:w-40"
        >
          <Construction className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={1.35} />
        </div>
      </div>
    </main>
  )
}