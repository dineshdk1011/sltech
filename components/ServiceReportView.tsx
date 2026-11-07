'use client'

import type { ElementType } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Package,
  Phone,
  Settings2,
  User,
  Wrench,
} from 'lucide-react'

import FormSection from './service-report/FormSection'
import ServiceReportExport from './SerivceReportExport'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Machine = {
  machine_name?: string | null
  model?: string | null
  serial_no?: string | null
  [key: string]: unknown
}

type PartMaterial = {
  name?: string | null
  quantity?: string | number | null
  [key: string]: unknown
}

export type ServiceReport = {
  id: string | number

  service_report_no: string | null

  customer_name: string | null
  date: string | null
  location: string | null
  contact_person: string | null
  phone: string | null

  service_types: string[]
  other_service_type: string | null

  machines: Machine[]

  service_details: string | null

  parts_materials: PartMaterial[]

  technician_remarks: string | null

  next_due_service_date: string | null

  technician_name: string | null
  technician_signature: string | null

  customer_site_incharge_name: string | null
  customer_site_incharge_signature: string | null
  customer_signature_seal: string | null

  created_by: string | number | null
  created_at: string | null
  updated_at: string | null
}

type ServiceReportViewProps = {
  report: ServiceReport
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (Array.isArray(value)) {
    return value.length
      ? value.map((item) => formatValue(item)).join(', ')
      : '—'
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }

  return String(value)
}

/* -------------------------------------------------------------------------- */
/* Reusable Detail Item                                                       */
/* -------------------------------------------------------------------------- */

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: unknown
  icon?: ElementType
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50">
            <Icon
              className="h-4 w-4 text-[#125FD0]"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium text-slate-800">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Signature Display                                                          */
/* -------------------------------------------------------------------------- */

function SignatureBox({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      {value ? (
        <div className="mt-3 rounded-md border border-slate-100 bg-slate-50 p-3">
          <p className="whitespace-pre-wrap text-sm font-medium text-slate-800">
            {value}
          </p>
        </div>
      ) : (
        <div className="mt-3 flex h-20 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50">
          <p className="text-xs italic text-slate-400">
            Not provided
          </p>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function ServiceReportView({
  report,
}: ServiceReportViewProps) {
  return (
    <main className="mb-12 min-h-screen rounded-2xl bg-[#f6f9fc] px-3 pt-8 pb-12 md:px-7 md:pt-12">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* ================================================================== */}
        {/* HEADER                                                             */}
        {/* ================================================================== */}

        <header className="border-b border-slate-200 pb-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

            <div>
              <Link
                href="/service-report"
                className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#125FD0] transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#125FD0]"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>

              <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.18em]">
                Service report
              </p>

              <h1 className="text-gradient-brand mt-2 text-3xl font-extrabold tracking-tight">
                Report Details
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Detailed service visit record, work completed,
                materials used, recommendations, and customer
                acknowledgement.
              </p>
            </div>

            {/* Report Number */}
            <div className="rounded-lg border border-blue-100 bg-white px-5 py-4 md:min-w-[230px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Report number
              </p>

              <p className="text-gradient-brand mt-1 text-lg font-bold">
                {report.service_report_no || '—'}
              </p>
            </div>

          </div>

          <div className="mt-5 flex justify-start md:justify-end">
            <ServiceReportExport report={report} />
          </div>
        </header>

        {/* ================================================================== */}
        {/* REPORT SUMMARY                                                     */}
        {/* ================================================================== */}

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                <FileText className="h-4 w-4 text-[#125FD0]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Report ID
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  #{report.id}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                <CalendarDays className="h-4 w-4 text-[#125FD0]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Service date
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {formatDate(report.date)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50">
                <User className="h-4 w-4 text-[#125FD0]" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Technician
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  {report.technician_name || '—'}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================== */}
        {/* CUSTOMER DETAILS                                                   */}
        {/* ================================================================== */}

        <FormSection title="Customer details">
          <div className="grid gap-4 md:grid-cols-2">

            <DetailItem
              label="Customer Name"
              value={report.customer_name}
              icon={User}
            />

            <DetailItem
              label="Date"
              value={formatDate(report.date)}
              icon={CalendarDays}
            />

            <DetailItem
              label="Location"
              value={report.location}
              icon={MapPin}
            />

            <DetailItem
              label="Service Report Number"
              value={report.service_report_no}
              icon={FileText}
            />

            <DetailItem
              label="Contact Person"
              value={report.contact_person}
              icon={User}
            />

            <DetailItem
              label="Phone"
              value={report.phone}
              icon={Phone}
            />

          </div>
        </FormSection>

        {/* ================================================================== */}
        {/* SERVICE TYPE                                                       */}
        {/* ================================================================== */}

        <FormSection title="Service type">

          {report.service_types?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {report.service_types.map((type) => (
                <span
                  key={type}
                  className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-[#125FD0]"
                >
                  {type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-slate-400">
              No service type recorded.
            </p>
          )}

          {report.other_service_type && (
            <div className="mt-2">
              <DetailItem
                label="Other Service Type"
                value={report.other_service_type}
              />
            </div>
          )}

        </FormSection>

        {/* ================================================================== */}
        {/* MACHINE DETAILS                                                    */}
        {/* ================================================================== */}

        <FormSection title="Machine details">

          {report.machines?.length > 0 ? (
            <div className="space-y-4">

              {report.machines.map((machine, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >

                  {/* Machine Header */}
                  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-50">
                      <Settings2 className="h-4 w-4 text-[#125FD0]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Machine {index + 1}
                      </p>

                      <p className="text-xs text-slate-500">
                        Equipment information
                      </p>
                    </div>

                  </div>

                  {/* Machine Data */}
                  <div className="grid gap-4 p-4 md:grid-cols-3">

                    <DetailItem
                      label="Machine Name"
                      value={machine.machine_name}
                    />

                    <DetailItem
                      label="Model"
                      value={machine.model}
                    />

                    <DetailItem
                      label="Serial Number"
                      value={machine.serial_no}
                    />

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <p className="text-sm italic text-slate-400">
              No machine details were recorded.
            </p>
          )}

        </FormSection>

        {/* ================================================================== */}
        {/* SERVICE DETAILS                                                    */}
        {/* ================================================================== */}

        <FormSection title="Service details">

          <div className="rounded-lg border border-slate-200 bg-white p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50">
                <Wrench className="h-5 w-5 text-[#125FD0]" />
              </div>

              <div className="min-w-0 flex-1">

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Work performed
                </p>

                {report.service_details ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {report.service_details}
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic text-slate-400">
                    No service details were recorded.
                  </p>
                )}

              </div>

            </div>

          </div>

        </FormSection>

        {/* ================================================================== */}
        {/* PARTS / MATERIALS                                                 */}
        {/* ================================================================== */}

        <FormSection title="Parts / materials used">

          {report.parts_materials?.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">

              {/* Table Header */}
              <div className="grid grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">

                <div className="col-span-7">
                  Part / Material
                </div>

                <div className="col-span-5">
                  Quantity
                </div>

              </div>

              {/* Table Rows */}
              {report.parts_materials.map((part, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 border-b border-slate-100 px-4 py-4 last:border-b-0"
                >

                  <div className="col-span-7 flex items-center gap-2">

                    <Package className="h-4 w-4 shrink-0 text-[#125FD0]" />

                    <span className="text-sm font-medium text-slate-800">
                      {part.name || '—'}
                    </span>

                  </div>

                  <div className="col-span-5 text-sm text-slate-700">
                    {formatValue(part.quantity)}
                  </div>

                </div>
              ))}

            </div>
          ) : (
            <p className="text-sm italic text-slate-400">
              No parts or materials were recorded.
            </p>
          )}

        </FormSection>

        {/* ================================================================== */}
        {/* TECHNICIAN REMARKS                                                */}
        {/* ================================================================== */}

        <FormSection title="Technician remarks / recommendations">

          <div className="rounded-lg border border-slate-200 bg-white p-5">

            {report.technician_remarks ? (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {report.technician_remarks}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                No remarks or recommendations were provided.
              </p>
            )}

          </div>

        </FormSection>

        {/* ================================================================== */}
        {/* SERVICE COMPLETION                                                 */}
        {/* ================================================================== */}

        <FormSection title="Service completion">

          <div className="grid gap-4 md:grid-cols-2">

            <DetailItem
              label="Next Due Service Date"
              value={formatDate(report.next_due_service_date)}
              icon={CalendarDays}
            />

            <DetailItem
              label="Technician Name"
              value={report.technician_name}
              icon={User}
            />

          </div>

          {/* Technician Signature */}
          <div className="mt-4">
            <SignatureBox
              label="Technician Signature"
              value={report.technician_signature}
            />
          </div>

        </FormSection>

        {/* ================================================================== */}
        {/* CUSTOMER ACKNOWLEDGEMENT                                           */}
        {/* ================================================================== */}

        <FormSection title="Customer acknowledgement">

          <div className="rounded-lg border border-green-200 bg-white p-5">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-semibold text-slate-800">
                  Customer acknowledgement
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Customer site in-charge and acknowledgement information
                  associated with this service report.
                </p>

              </div>

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">

              <DetailItem
                label="Customer Site In-charge"
                value={report.customer_site_incharge_name}
                icon={User}
              />

              <SignatureBox
                label="Site In-charge Signature"
                value={report.customer_site_incharge_signature}
              />

              <SignatureBox
                label="Customer Signature / Seal"
                value={report.customer_signature_seal}
              />

            </div>

          </div>

        </FormSection>

        {/* ================================================================== */}
        {/* REPORT TIMELINE / METADATA                                        */}
        {/* ================================================================== */}

        <FormSection title="Report information">

          <div className="grid gap-4 md:grid-cols-2">

            <DetailItem
              label="Created At"
              value={formatDateTime(report.created_at)}
              icon={Clock3}
            />

            <DetailItem
              label="Last Updated"
              value={formatDateTime(report.updated_at)}
              icon={Clock3}
            />

            <DetailItem
              label="Created By"
              value={report.created_by}
              icon={User}
            />

            <DetailItem
              label="Report ID"
              value={report.id}
              icon={FileText}
            />

          </div>

        </FormSection>

        {/* ================================================================== */}
        {/* FOOTER                                                             */}
        {/* ================================================================== */}

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            Service report{' '}
            <span className="font-medium text-slate-700">
              {report.service_report_no || '—'}
            </span>
          </p>

          <p>
            Technician:{' '}
            <span className="font-medium text-slate-700">
              {report.technician_name || '—'}
            </span>
          </p>

        </div>

      </div>
    </main>
  )
}