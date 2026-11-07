/**
 * Careers design tokens.
 *
 * These class strings are lifted verbatim from the existing site so the Careers
 * page is a native extension of it:
 *   - primary CTA  → components/EnquireButton.tsx / components/Header.tsx
 *   - secondary CTA→ components/Home.tsx (Call Now) / components/ui.tsx
 *   - card / section surfaces → components/About-us.tsx / components/Services.tsx
 * Keep them in sync with those files rather than inventing new values.
 */

export const primaryButtonClass =
  'group inline-flex h-[46px] items-center justify-center gap-2 rounded-[13px] bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] px-5 text-[13px] font-semibold text-white shadow-[0_7px_20px_rgba(0,43,139,0.24)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:brightness-[1.06] hover:shadow-[0_10px_25px_rgba(18,104,216,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B] focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100 xl:px-7 xl:text-sm'

export const secondaryButtonClass =
  'group inline-flex h-[46px] items-center justify-center gap-2 rounded-[13px] border border-[#0753B8]/20 bg-[#F2F7FF] px-5 text-[13px] font-semibold text-[#002B8B] shadow-[0_5px_16px_rgba(0,43,139,0.10)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#002B8B] hover:bg-gradient-to-r hover:from-[#002B8B] hover:via-[#0753B8] hover:to-[#1268D8] hover:text-white hover:brightness-[1.04] hover:shadow-[0_10px_25px_rgba(18,104,216,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B] focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100 xl:px-6 xl:text-sm'

export const eyebrowClass =
  'text-gradient-brand inline-flex items-center gap-2 rounded-full bg-[#E7F0FD] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em]'

export const sectionLabelClass =
  'text-gradient-brand text-xs font-bold uppercase tracking-[0.16em]'

export const cardClass =
  'rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgba(15,43,77,0.05)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#CFE5FA] hover:shadow-[0_18px_40px_rgba(0,43,139,0.12)]'

export const iconTileClass =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FD] text-[#002B8B]'

export const chipClass =
  'inline-flex items-center gap-1.5 rounded-full border border-[#DCEBFA] bg-[#F2F7FF] px-3 py-1 text-xs font-semibold text-[#0753B8]'

export const inputClass =
  'h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#002B8B] focus:ring-2 focus:ring-[#002B8B]/20 disabled:cursor-not-allowed disabled:bg-slate-50'

export const textareaClass =
  'min-h-[120px] w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#002B8B] focus:ring-2 focus:ring-[#002B8B]/20 disabled:cursor-not-allowed disabled:bg-slate-50'

export const labelClass = 'text-sm font-medium text-slate-700'