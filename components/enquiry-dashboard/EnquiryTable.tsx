import {
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react"
import DataTable, { TableColumn } from "@/components/DataTable"

export type EnquiryRecord = {
  id?: string | number
  name?: string | null
  contact?: string | null
  email?: string | null
  enquiry_type?: string | null
  enquiry?: string | null
  last_update?: string | null
  location?: string | null
  address?: string | null
  status?: string | null
  created_at?: string | null
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

function StatusBadge({ status }: { status?: string | null }) {
  const value = text(status)
  const isNew = value.toLowerCase() === "new"

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
        isNew
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-600",
      ].join(" ")}
    >
      <span
        className={[
          "h-2 w-2 rounded-full",
          isNew ? "bg-amber-600" : "bg-slate-400",
        ].join(" ")}
      />
      {value}
    </span>
  )
}

function EnquiryMobileCard({ row }: { row: EnquiryRecord }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]">
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{text(row.name)}</p>
            <a
              href={`tel:${text(row.contact)}`}
              className="mt-1 flex items-start gap-1 text-xs text-slate-500 hover:text-[#125FD0]"
            >
              <Phone className="mt-0.5 h-3 w-3 shrink-0" />
              {text(row.contact)}
            </a>
            {text(row.email) !== "—" && (
              <a
                href={`mailto:${text(row.email)}`}
                className="mt-1 flex items-start gap-1 break-all text-xs text-slate-500 hover:text-[#125FD0]"
              >
                <Mail className="mt-0.5 h-3 w-3 shrink-0" />
                {text(row.email)}
              </a>
            )}
          </div>
        </div>

        <StatusBadge status={row.status} />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="font-medium text-slate-700">{text(row.enquiry_type)}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{text(row.enquiry)}</p>

        <div className="mt-3 flex items-start gap-1.5 text-sm text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <div>
            <p>{text(row.location)}</p>
            <p className="text-xs text-slate-400">{text(row.address)}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">{formatDate(row.created_at)}</p>
      </div>
    </article>
  )
}

export default function EnquiriesTable({
  enquiries,
}: {
  enquiries: EnquiryRecord[]
}) {
  const columns: TableColumn<EnquiryRecord>[] = [
    {
      key: "contact",
      label: "Contact",
      sortable: true,
      sortValue: (row) => row.name ?? "",
      className: "w-[25%]",
      render: (row) => (
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]">
            <UserRound className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="font-semibold leading-5 text-slate-900">{text(row.name)}</p>

            <a
              className="mt-1 flex items-start gap-1 text-xs leading-4 text-slate-500 hover:text-[#125FD0]"
              href={`tel:${text(row.contact)}`}
            >
              <Phone className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{text(row.contact)}</span>
            </a>

            {text(row.email) !== "—" && (
              <a
                className="mt-1 flex items-start gap-1 break-all text-xs leading-4 text-slate-500 hover:text-[#125FD0]"
                href={`mailto:${text(row.email)}`}
              >
                <Mail className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{text(row.email)}</span>
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "enquiry",
      label: "Enquiry",
      sortable: true,
      sortValue: (row) => row.enquiry_type ?? "",
      className: "w-[25%]",
      render: (row) => (
        <>
          <p className="font-medium leading-5 text-slate-700">{text(row.enquiry_type)}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{text(row.enquiry)}</p>
          {text(row.last_update) !== "—" && (
            <p className="mt-2 text-xs leading-4 text-slate-400">
              Update: {text(row.last_update)}
            </p>
          )}
        </>
      ),
    },
    {
      key: "location",
      label: "Location",
      sortable: true,
      sortValue: (row) => row.location ?? "",
      className: "w-[20%]",
      render: (row) => (
        <span className="flex items-start gap-1.5 leading-5 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span className="min-w-0">
            {text(row.location)}
            <span className="mt-1 block text-xs leading-4 text-slate-400">
              {text(row.address)}
            </span>
          </span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      sortValue: (row) => row.status ?? "",
      className: "w-[18%]",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "created_at",
      label: "Received",
      sortable: true,
      sortValue: (row) => row.created_at ?? "",
      className: "w-[12%]",
      render: (row) => (
        <span className="text-slate-500">{formatDate(row.created_at)}</span>
      ),
    },
  ]

  return (
    <DataTable
      rows={enquiries}
      columns={columns}
      getRowKey={(row, index) => String(row.id ?? `${row.email}-${index}`)}
      title="All submissions"
      description={`Showing all ${enquiries.length} enquiries`}
      searchPlaceholder="Search enquiries"
      searchText={(row) =>
        [
          row.name,
          row.contact,
          row.email,
          row.enquiry_type,
          row.enquiry,
          row.location,
          row.address,
          row.status,
        ]
          .filter(Boolean)
          .join(" ")
      }
      emptyTitle="No enquiries found"
      emptyDescription="Try a different name, business, service, or location."
      initialSortKey="created_at"
      initialSortDirection="desc"
      mobileCard={({ row }) => <EnquiryMobileCard row={row} />}
    />
  )
}
