import type { ReactNode } from 'react'

export default function FormSection({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <div className={action ? 'mb-5 flex items-center justify-between gap-3' : 'mb-5'}>
        <h2 className="text-gradient-brand text-xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}