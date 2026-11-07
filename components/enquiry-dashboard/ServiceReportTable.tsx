
"use client"

import Link from "next/link"
import {
  CalendarDays,
  ClipboardList,
  Eye,
  FileSpreadsheet,
  LoaderCircle,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react"
import ExcelJS from "exceljs"
import { useState } from "react"
import DataTable, { TableColumn } from "@/components/DataTable"

export type ServiceReportRecord = {
  id?: string | number
  service_report_no?: string | null
  customer_name?: string | null
  date?: string | null
  location?: string | null
  contact_person?: string | null
  phone?: string | null
  service_types?: string[] | null
  other_service_type?: string | null
  technician_name?: string | null
  next_due_service_date?: string | null
  technician_remarks?: string | null
  is_active?: boolean | string | null
}

const text = (value: unknown) => {
  const result = String(value ?? "").trim()
  return result || "—"
}

const formatDate = (value: unknown) => {
  if (!value) return "—"

  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return text(value)

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

const serviceTypeText = (row: ServiceReportRecord) => {
  const types = row.service_types ?? []
  const all = row.other_service_type
    ? [...types, row.other_service_type]
    : types

  return all.length ? all.join(", ") : "—"
}

function ServiceReportMobileCard({
  row,
  viewHref,
  onDelete,
  isDeleting,
}: {
  row: ServiceReportRecord
  viewHref: string
  onDelete?: (row: ServiceReportRecord) => void | Promise<void>
  isDeleting: boolean
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.12em]">
            {text(row.service_report_no)}
          </p>

          <h3 className="text-gradient-brand mt-1 font-semibold">
            {text(row.customer_name)}
          </h3>
        </div>

        <div className="flex shrink-0 flex-nowrap items-center gap-2">
          {/* View */}
          {row.id != null && (
            <Link
              href={viewHref}
              aria-label={`View ${text(row.service_report_no)}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}

          {/* Delete */}
          {onDelete && (
            <button
              type="button"
              aria-label={`Delete ${text(row.service_report_no)}`}
              onClick={() => void onDelete(row)}
              disabled={isDeleting}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-wait disabled:opacity-60"
            >
              {isDeleting ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 border-t border-slate-100 pt-3 text-sm">
        <div className="flex items-start gap-2">
          <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span>{text(row.contact_person)}</span>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span>{text(row.phone)}</span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span>{text(row.location)}</span>
        </div>

        <div className="flex items-start gap-2">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span>{serviceTypeText(row)}</span>
        </div>

        <div className="flex items-start gap-2 text-slate-500">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Service: {formatDate(row.date)}</span>
        </div>

        <div className="text-xs text-slate-400">
          Next due: {formatDate(row.next_due_service_date)}
        </div>
      </div>
    </article>
  )
}

export default function ServiceReportTable({
  reports,
  onDelete,
  addReportHref = "/service-report/new",
  viewReportHref = (id) => `/service-report/${id}`,
}: {
  reports: ServiceReportRecord[]
  onDelete?: (report: ServiceReportRecord) => void | Promise<void>
  addReportHref?: string
  viewReportHref?: (id: string | number) => string
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState("")
  const [deletingReportId, setDeletingReportId] = useState<string | number | null>(null)

  const handleDelete = async (row: ServiceReportRecord) => {
    if (row.id == null || !onDelete) return
    if (
      !window.confirm(
        `Delete service report ${text(row.service_report_no)}? It will be removed from the list.`,
      )
    )
      return

    setDeletingReportId(row.id)
    try {
      await onDelete(row)
    } finally {
      setDeletingReportId(null)
    }
  }

  const handleExport = async () => {
    setExportError("")
    setIsExporting(true)

    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Service Reports")
      worksheet.columns = [
        { header: "Service Report Number", key: "reportNo", width: 24 },
        { header: "Customer", key: "customer", width: 28 },
        { header: "Date", key: "date", width: 16 },
        { header: "Contact Person", key: "contact", width: 24 },
        { header: "Phone", key: "phone", width: 18 },
        { header: "Location", key: "location", width: 32 },
        { header: "Service Type", key: "serviceType", width: 30 },
        { header: "Technician", key: "technician", width: 24 },
        { header: "Next Due Date", key: "nextDue", width: 16 },
        { header: "Technician Remarks", key: "remarks", width: 40 },
      ]
      worksheet.getRow(1).font = { bold: true }
      reports.forEach((report) => {
        worksheet.addRow({
          reportNo: text(report.service_report_no),
          customer: text(report.customer_name),
          date: text(report.date),
          contact: text(report.contact_person),
          phone: text(report.phone),
          location: text(report.location),
          serviceType: serviceTypeText(report),
          technician: text(report.technician_name),
          nextDue: text(report.next_due_service_date),
          remarks: text(report.technician_remarks),
        })
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = "service-reports.xlsx"
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    } catch {
      setExportError("Could not export service reports. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const columns: TableColumn<ServiceReportRecord>[] = [
    {
      key: "report",
      label: "Service report",
      sortable: true,
      sortValue: (row) => row.service_report_no ?? "",
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]">
            <ClipboardList className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">
              {text(row.service_report_no)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {formatDate(row.date)}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "customer",
      label: "Customer",
      sortable: true,
      sortValue: (row) => row.customer_name ?? "",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700">
            {text(row.customer_name)}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {text(row.contact_person)}
          </p>

          {text(row.phone) !== "—" && (
            <a
              href={`tel:${text(row.phone)}`}
              className="mt-1 block text-xs text-slate-500 hover:text-[#125FD0]"
            >
              {text(row.phone)}
            </a>
          )}
        </div>
      ),
    },

    {
      key: "location",
      label: "Location",
      sortable: true,
      sortValue: (row) => row.location ?? "",
      render: (row) => (
        <span className="flex items-start gap-1.5 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span className="min-w-0">{text(row.location)}</span>
        </span>
      ),
    },

    {
      key: "service_type",
      label: "Service type",
      sortable: true,
      sortValue: (row) => serviceTypeText(row),
      render: (row) => (
        <div>
          <p className="font-medium text-slate-700">
            {serviceTypeText(row)}
          </p>

          {row.technician_name && (
            <p className="mt-1 text-xs text-slate-400">
              Engineer: {row.technician_name}
            </p>
          )}
        </div>
      ),
    },

    {
      key: "next_due",
      label: "Next due",
      sortable: true,
      sortValue: (row) => row.next_due_service_date ?? "",
      render: (row) => (
        <span className="text-slate-500">
          {formatDate(row.next_due_service_date)}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      className: "whitespace-nowrap",
      render: (row) => {
        const id = row.id

        return (
          <div className="flex flex-nowrap items-center gap-2">
            {id != null && (
              <Link
                href={viewReportHref(id)}
                aria-label={`View ${text(row.service_report_no)}`}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                type="button"
                aria-label={`Delete ${text(row.service_report_no)}`}
                onClick={() => void handleDelete(row)}
                disabled={deletingReportId === id}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-red-100 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-wait disabled:opacity-60"
              >
                {deletingReportId === id ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="pb-12">
      {exportError && <p className="mb-3 text-sm text-red-700" role="alert">{exportError}</p>}
      <DataTable
        rows={reports}
        columns={columns}
        getRowKey={(row, index) =>
          String(row.id ?? `${row.service_report_no}-${index}`)
        }
        title="All service reports"
        description={`Showing all ${reports.length} service reports`}
        searchPlaceholder="Search service reports"
        searchText={(row) =>
          [
            row.service_report_no,
            row.customer_name,
            row.contact_person,
            row.phone,
            row.location,
            serviceTypeText(row),
            row.technician_name,
            row.technician_remarks,
          ]
            .filter(Boolean)
            .join(" ")
        }
        emptyTitle="No service reports found"
        emptyDescription="Create a service report to see it here."
        initialSortKey="next_due"
        initialSortDirection="desc"
        horizontalScroll={false}
        equalColumnWidths
        mobileCard={({ row }) => (
          <ServiceReportMobileCard
            row={row}
            viewHref={
              row.id != null ? viewReportHref(row.id) : addReportHref
            }
            onDelete={onDelete ? handleDelete : undefined}
            isDeleting={deletingReportId === row.id}
          />
        )}
        headerRight={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={isExporting || reports.length === 0}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              {isExporting ? "Exporting..." : "Excel Report"}
            </button>
            <Link
              href={addReportHref}
              className="
            group
            w-fit
            inline-flex
            h-10
            items-center
            justify-center
            gap-2
            border border-[#002B8B]
            bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8]
            px-4
            text-sm
            font-semibold
            rounded-md
            text-white
            shadow-[0_5px_16px_rgba(0,43,139,0.20)]
            transition-all duration-300 ease-out
            hover:-translate-y-0.5
            hover:brightness-[1.06]
            hover:shadow-[0_8px_20px_rgba(18,104,216,0.28)]
            active:translate-y-0
            active:scale-[0.98]
          "
            >
              <Plus
                className="
              h-4 w-4
              transition-transform duration-300 ease-out
              group-hover:rotate-90
            "
              />
              Add
            </Link>
          </div>
        }
      />
    </div>
  )
}
