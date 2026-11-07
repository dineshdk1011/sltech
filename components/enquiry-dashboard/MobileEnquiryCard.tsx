import { Mail, MapPin, Phone, UserRound } from 'lucide-react'

import StatusBadge from './StatusBadge'
import { getDate, getLocation, getStatus, getText, type EnquiryRecord } from './utils'

export default function MobileEnquiryCard({ enquiry }: { enquiry: EnquiryRecord }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_4px_16px_rgba(15,43,77,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]"><UserRound className="h-4 w-4" /></div>
          <div className="min-w-0">
            <p className="break-words font-semibold leading-5 text-slate-900">{getText(enquiry.name)}</p>
            <a className="mt-1 flex items-start gap-1 break-words text-xs leading-4 text-slate-500" href={`tel:${getText(enquiry.contact)}`}><Phone className="mt-0.5 h-3 w-3 shrink-0" /><span>{getText(enquiry.contact)}</span></a>
          </div>
        </div>
        <span className="shrink-0 text-right text-xs leading-4 text-slate-500">{getDate(enquiry.created_at)}</span>
      </div>

      {getText(enquiry.email) !== '—' && <a className="mt-3 flex items-start gap-1 break-all text-xs leading-4 text-slate-500" href={`mailto:${getText(enquiry.email)}`}><Mail className="mt-0.5 h-3 w-3 shrink-0" /><span>{getText(enquiry.email)}</span></a>}

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Enquiry</p>
          <p className="mt-1 break-words font-medium leading-5 text-slate-700">{getText(enquiry.enquiry_type)}</p>
          <p className="mt-1 break-words text-xs leading-5 text-slate-500">{getText(enquiry.enquiry)}</p>
          {getText(enquiry.last_update) !== '—' && <p className="mt-2 break-words text-xs leading-4 text-slate-400">Update: {getText(enquiry.last_update)}</p>}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Location</p>
          <p className="mt-1 flex items-start gap-1.5 break-words leading-5 text-slate-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" /><span className="min-w-0 break-words">{getLocation(enquiry)}<span className="mt-1 block break-words text-xs leading-4 text-slate-400">{getText(enquiry.address)}</span></span></p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3"><StatusBadge status={getStatus(enquiry)} /></div>
    </article>
  )
}
