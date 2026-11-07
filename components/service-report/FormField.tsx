import type { InputHTMLAttributes, ReactNode } from 'react'

export const inputClass = 'h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#002B8B] focus:ring-2 focus:ring-[#002B8B]/20'
export const textClass = 'min-h-[120px] w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#002B8B] focus:ring-2 focus:ring-[#002B8B]/20'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  tooltip?: string
  children?: ReactNode
}

export default function FormField({ label, required, tooltip, className = '', children, ...props }: FormFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700" title={tooltip}>
      {label}{required && <span className="text-red-500"> *</span>}
      {children || <input {...props} required={required} className={`${inputClass} mt-1.5 ${className}`} />}
    </label>
  )
}