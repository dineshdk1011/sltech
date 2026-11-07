export default function StatusBadge({ status }: { status: string }) {
  const styles = status === 'Converted'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : status === 'Connected'
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : 'border-amber-200 bg-amber-50 text-amber-700'

  return (
    <span className={`inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold leading-4 ${styles}`}>
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
