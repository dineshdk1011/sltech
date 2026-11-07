import type { ReactNode } from 'react'

export default function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(15,43,77,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf4fd] text-[#125FD0]">{icon}</div>
      <div>
        <p className="text-gradient-brand text-2xl font-extrabold">{value}</p>
        <p className="text-xs font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}
