import { LoaderCircle } from 'lucide-react'

export default function Loader({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-slate-600" role="status" aria-live="polite">
      <LoaderCircle className="h-5 w-5 animate-spin text-[#125FD0]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}