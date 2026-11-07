"use client"

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import { ReactNode, useMemo, useState } from "react"

export type SortDirection = "asc" | "desc"

export type TableColumn<T> = {
  key: string
  label: string
  sortable?: boolean
  sortValue?: (row: T) => string | number | Date | null | undefined
  className?: string
  render: (row: T) => ReactNode
}

export type MobileTableCardProps<T> = {
  row: T
  index: number
}

type DataTableProps<T> = {
  rows: T[]
  columns: TableColumn<T>[]
  getRowKey: (row: T, index: number) => string
  searchPlaceholder?: string
  searchText?: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  pageSizeOptions?: number[]
  initialPageSize?: number
  initialSortKey?: string
  initialSortDirection?: SortDirection
  mobileCard?: (props: MobileTableCardProps<T>) => ReactNode
  headerRight?: ReactNode
  title?: string
  description?: string
  toolbar?: ReactNode
  rowClassName?: string
  searchable?: boolean
  horizontalScroll?: boolean
  equalColumnWidths?: boolean
}

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase()
}

function compareValues(
  a: string | number | Date | null | undefined,
  b: string | number | Date | null | undefined,
) {
  if (a instanceof Date || b instanceof Date) {
    const aTime = a instanceof Date ? a.getTime() : new Date(String(a ?? "")).getTime()
    const bTime = b instanceof Date ? b.getTime() : new Date(String(b ?? "")).getTime()
    return aTime - bTime
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b
  }

  return normalize(a).localeCompare(normalize(b), undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

export default function DataTable<T>({
  rows,
  columns,
  getRowKey,
  searchPlaceholder = "Search",
  searchText,
  emptyTitle = "No records found",
  emptyDescription = "Try changing your search or filters.",
  pageSizeOptions = [5, 10, 25],
  initialPageSize = 5,
  initialSortKey,
  initialSortDirection = "desc",
  mobileCard,
  headerRight,
  title,
  description,
  toolbar,
  rowClassName = "",
  searchable = true,
  horizontalScroll = true,
  equalColumnWidths = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState(initialSortKey ?? "")
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(initialSortDirection)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRows = useMemo(() => {
    const query = normalize(search)

    if (!query || !searchText) {
      return rows
    }

    return rows.filter((row) => normalize(searchText(row)).includes(query))
  }, [rows, search, searchText])

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows

    const column = columns.find((item) => item.key === sortKey)
    if (!column?.sortValue) return filteredRows

    return [...filteredRows].sort((a, b) => {
      const result = compareValues(column.sortValue!(a), column.sortValue!(b))
      return sortDirection === "asc" ? result : -result
    })
  }, [columns, filteredRows, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStart = sortedRows.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const pageEnd = Math.min(safeCurrentPage * pageSize, sortedRows.length)

  const pageRows = useMemo(
    () =>
      sortedRows.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize,
      ),
    [safeCurrentPage, pageSize, sortedRows],
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleSort = (key: string) => {
    setCurrentPage(1)

    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection("asc")
  }

  const handlePageSize = (value: number) => {
    setPageSize(value)
    setCurrentPage(1)
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,43,77,0.05)]">
      {(title || description || searchable || headerRight || toolbar) && (
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {title && <h2 className="text-gradient-brand text-lg font-bold">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            {toolbar}

            {searchable && (
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">{searchPlaceholder}</span>
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><Search className="h-4 w-4 text-slate-400" /></span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }}
                  placeholder={searchPlaceholder}
                  className="enquiry-search-input h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 text-sm leading-5 text-slate-900 outline-none transition focus:border-[#125FD0] focus:bg-white focus:ring-2 focus:ring-[#125FD0]/10"
                />
              </label>
            )}

            {headerRight}
          </div>
        </div>
      )}

      {sortedRows.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Search className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="text-gradient-brand mt-3 font-semibold">{emptyTitle}</h3>
          <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>
        </div>
      ) : (
        <>
          {mobileCard && (
            <div className="space-y-3 p-3 md:hidden">
              {pageRows.map((row, index) => (
                <div key={getRowKey(row, index)}>
                  {mobileCard({ row, index })}
                </div>
              ))}
            </div>
          )}

          <div
            className={`${mobileCard ? "hidden " : ""}${horizontalScroll ? "overflow-x-auto" : "overflow-hidden"}${mobileCard ? " md:block" : ""}`}
          >
            <table className="w-full table-fixed text-left text-sm">
              {equalColumnWidths && (
                <colgroup>
                  {columns.map((column) => (
                    <col
                      key={column.key}
                      style={{ width: `${100 / columns.length}%` }}
                    />
                  ))}
                </colgroup>
              )}
              <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  {columns.map((column) => {
                    const active = sortKey === column.key

                    return (
                      <th
                        key={column.key}
                        className={`wrap-break-word px-3 py-3 font-bold ${column.className ?? ""}`}
                      >
                        {column.sortable ? (
                          <button
                            type="button"
                            onClick={() => handleSort(column.key)}
                            className="inline-flex items-center gap-1.5 transition hover:text-[#125FD0]"
                          >
                            {column.label}
                            {active ? (
                              sortDirection === "asc" ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowDown className="h-3.5 w-3.5" />
                              )
                            ) : (
                              <span className="text-slate-300">↕</span>
                            )}
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {pageRows.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    className={`align-top transition-colors hover:bg-[#f8fbff] ${rowClassName}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`wrap-break-word px-3 py-3 align-top ${column.className ?? ""}`}
                      >
                        {column.render(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {sortedRows.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {pageStart}–{pageEnd} of {sortedRows.length}
          </p>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <span className="sr-only">Rows per page</span>
              <select
                value={pageSize}
                onChange={(event) => handlePageSize(Number(event.target.value))}
                className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#125FD0] focus:ring-2 focus:ring-[#125FD0]/10"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous page"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="min-w-16 text-center text-xs font-medium text-slate-600">
                {safeCurrentPage} / {totalPages}
              </span>

              <button
                type="button"
                aria-label="Next page"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
