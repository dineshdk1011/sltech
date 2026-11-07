import { Loader2, ShieldCheck } from 'lucide-react'

export default function StatusScreen({ title }: { title: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f9fc] px-4 py-16">
      <section className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,43,77,0.06)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h1 className="text-gradient-brand mt-5 text-lg font-bold">Enquiry dashboard</h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">{title}</p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-[#125FD0]" />
          Please wait
        </div>
      </section>
    </main>
  )
}
