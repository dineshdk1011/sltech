import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import type { SortColumn, SortDirection } from './utils'

export default function SortableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
}: {
  label: string
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}) {
  const isActive = sortColumn === column
  const SortIcon = isActive ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <th aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'} className="px-4 py-3 text-left align-middle font-bold lg:px-5">
      <button
        type="button"
        onClick={() => onSort(column)}
        className={`group inline-flex min-h-8 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30 ${isActive ? 'bg-[#eaf4fd] text-[#125FD0]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
      >
        <span>{label}</span>
        <SortIcon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-[#125FD0]' : 'text-slate-400 group-hover:text-slate-600'}`} />
      </button>
    </th>
  )
}
