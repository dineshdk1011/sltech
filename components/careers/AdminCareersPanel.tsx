'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle,
  Eye,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  UserRound,
} from 'lucide-react'

import DataTable, { type TableColumn } from '@/components/DataTable'
import { deleteJob, fetchAllJobs, fetchApplications, setJobStatus } from '@/lib/careers'

import ApplicationDetails from './ApplicationDetails'
import ConfirmDialog from './ConfirmDialog'
import JobOpeningForm from './JobOpeningForm'
import PublishSuccessDialog, { type PublishedJobSummary } from './PublishSuccessDialog'
import type { JobApplication, JobOpening } from './types'
import { primaryButtonClass, secondaryButtonClass } from './styles'
import { formatDateTime, isMissingSchemaError } from './utils'

function OpeningStatusBadge({ status }: { status: string }) {
  const styles =
    status === 'published'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'closed'
        ? 'border-slate-200 bg-slate-100 text-slate-600'
        : 'border-amber-200 bg-amber-50 text-amber-700'

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold capitalize ${styles}`}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}

const actionButtonClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30 disabled:cursor-not-allowed disabled:opacity-50'

export default function AdminCareersPanel({
  allowedUserId,
  onOpeningsChanged,
}: {
  allowedUserId: number | string | null
  onOpeningsChanged: () => void
}) {
  const [tab, setTab] = useState<'openings' | 'applications'>('openings')
  const [openings, setOpenings] = useState<JobOpening[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [setupRequired, setSetupRequired] = useState(false)
  const [actionError, setActionError] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<JobOpening | null>(null)
  const [pendingDelete, setPendingDelete] = useState<JobOpening | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null)
  const [publishedJob, setPublishedJob] = useState<PublishedJobSummary | null>(null)

  // No setState before the first `await`, so mounting the effect never triggers
  // a synchronous cascading render (see react-hooks/set-state-in-effect).
  const load = useCallback(async () => {
    try {
      const [jobs, apps] = await Promise.all([fetchAllJobs(), fetchApplications()])
      setOpenings(jobs)
      setApplications(apps)
      setLoadError('')
      setSetupRequired(false)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load the careers data.')
      setSetupRequired(isMissingSchemaError(error))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    // Deferred to a task so the initial load never calls setState synchronously
    // inside the effect body (react-hooks/set-state-in-effect).
    const timer = window.setTimeout(() => {
      void load()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [load])

  const refresh = useCallback(async () => {
    setIsRefreshing(true)
    await load()
    onOpeningsChanged()
  }, [load, onOpeningsChanged])

  const handleToggleStatus = async (opening: JobOpening) => {
    setActionError('')
    setBusyId(opening.id)

    try {
      const willPublish = opening.status !== 'published'
      await setJobStatus(opening.id, willPublish ? 'published' : 'closed')
      await refresh()

      if (willPublish) {
        setPublishedJob({
          title: opening.title,
          department: opening.department,
          location: opening.location,
          employment_type: opening.employment_type,
          experience: opening.experience,
          short_description: opening.short_description,
          published_at: new Date().toISOString(),
        })
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not change the opening status.',
      )
    } finally {
      setBusyId(null)
    }
  }

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return

    setIsDeleting(true)
    setActionError('')

    try {
      await deleteJob(pendingDelete.id)
      setPendingDelete(null)
      await refresh()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Could not delete the job opening.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const openingColumns: TableColumn<JobOpening>[] = [
    {
      key: 'title',
      label: 'Opening',
      sortable: true,
      sortValue: (row) => row.title,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{row.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{row.department || '—'}</p>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      sortable: true,
      sortValue: (row) => row.location ?? '',
      render: (row) => <span className="text-sm text-slate-600">{row.location || '—'}</span>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className="text-sm text-slate-600">{row.employment_type || '—'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      sortValue: (row) => row.status,
      render: (row) => <OpeningStatusBadge status={row.status} />,
    },
    {
      key: 'created',
      label: 'Created',
      sortable: true,
      sortValue: (row) => row.created_at ?? '',
      render: (row) => (
        <span className="text-sm text-slate-600">{formatDateTime(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-[176px]',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleToggleStatus(row)}
            disabled={busyId === row.id}
            aria-label={row.status === 'published' ? `Unpublish ${row.title}` : `Publish ${row.title}`}
            title={row.status === 'published' ? 'Unpublish' : 'Publish'}
            className={actionButtonClass}
          >
            {busyId === row.id ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(row)
              setFormOpen(true)
            }}
            aria-label={`Edit ${row.title}`}
            title="Edit"
            className={actionButtonClass}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setPendingDelete(row)}
            aria-label={`Delete ${row.title}`}
            title="Delete"
            className={`${actionButtonClass} border-red-100 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ]

  const applicationColumns: TableColumn<JobApplication>[] = [
    {
      key: 'candidate',
      label: 'Candidate',
      sortable: true,
      sortValue: (row) => row.full_name,
      render: (row) => (
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF4FD] text-[#125FD0]">
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{row.full_name}</p>
            <p className="mt-0.5 flex items-center gap-1 break-all text-xs text-slate-500">
              <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
              {row.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
              {row.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      sortValue: (row) => row.position,
      render: (row) => <span className="text-sm font-medium text-slate-700">{row.position}</span>,
    },
    {
      key: 'experience',
      label: 'Experience',
      render: (row) => (
        <span className="text-sm text-slate-600">{row.years_of_experience || '—'}</span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => (
        <span className="text-sm text-slate-600">{row.current_location || '—'}</span>
      ),
    },
    {
      key: 'applied',
      label: 'Applied',
      sortable: true,
      sortValue: (row) => row.created_at ?? '',
      render: (row) => (
        <span className="text-sm text-slate-600">{formatDateTime(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Resume',
      render: (row) => (
        <button
          type="button"
          onClick={() => setViewingApplication(row)}
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[#DCEBFA] bg-[#F2F7FF] px-3 py-1.5 text-xs font-bold text-[#0753B8] transition hover:border-[#002B8B] hover:text-[#002B8B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          View
        </button>
      ),
    },
  ]

  return (
    <section aria-labelledby="careers-admin-heading" className="pt-16">
      <div className="rounded-3xl border border-[#DCEBFA] bg-white p-5 shadow-[0_10px_35px_rgba(0,43,139,0.09)] sm:p-7">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF4FD] text-[#002B8B]">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div>
              <p className="text-gradient-brand text-xs font-bold uppercase tracking-[0.16em]">Admin</p>
              <h2 id="careers-admin-heading" className="text-gradient-brand mt-1 text-2xl font-extrabold">
                Careers Management
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Manage job openings and review candidate applications.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={isLoading || isRefreshing}
              className={`${secondaryButtonClass} h-11`}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`}
                strokeWidth={1.9}
                aria-hidden="true"
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
              className={`${primaryButtonClass} h-11`}
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Add Opening
            </button>
          </div>
        </div>

        <div
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Careers management sections"
        >
          {(['openings', 'applications'] as const).map((id) => {
            const label =
              id === 'openings'
                ? `Openings (${openings.length})`
                : `Applications (${applications.length})`
            const isActive = tab === id

            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(id)}
                className={`min-h-[42px] rounded-[13px] px-4 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B]/30 ${
                  isActive
                    ? 'bg-gradient-to-br from-[#1268D8] to-[#002B8B] text-white shadow-[0_5px_16px_rgba(18,104,216,0.28)]'
                    : 'text-slate-600 hover:bg-[#EAF4FD] hover:text-[#002B8B]'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {actionError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
            <LoaderCircle className="h-6 w-6 animate-spin text-[#1268D8]" aria-hidden="true" />
            <span className="ml-2 text-sm text-slate-600">Loading careers data…</span>
          </div>
        ) : loadError ? (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <p className="font-bold text-amber-900">
                {setupRequired ? 'Careers tables are not set up yet' : 'Could not load careers data'}
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                {setupRequired
                  ? 'Run supabase/careers_setup.sql in the Supabase SQL editor to create the job_openings and job_applications tables and the resumes storage bucket.'
                  : loadError}
              </p>
            </div>
          </div>
        ) : tab === 'openings' ? (
          <div className="mt-5">
            <DataTable
              rows={openings}
              columns={openingColumns}
              getRowKey={(row) => row.id}
              searchPlaceholder="Search openings"
              searchText={(row) =>
                [row.title, row.department, row.location, row.employment_type, row.status]
                  .filter(Boolean)
                  .join(' ')
              }
              emptyTitle="No job openings yet"
              emptyDescription="Add your first opening to publish it on the Careers page."
              initialSortKey="created"
              initialSortDirection="desc"
              horizontalScroll={false}
              mobileCard={({ row }) => (
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{row.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {[row.department, row.location].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </div>
                    <OpeningStatusBadge status={row.status} />
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleToggleStatus(row)}
                      disabled={busyId === row.id}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:opacity-50"
                    >
                      {busyId === row.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="h-4 w-4" aria-hidden="true" />
                      )}
                      {row.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row)
                        setFormOpen(true)
                      }}
                      className={actionButtonClass}
                      aria-label={`Edit ${row.title}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPendingDelete(row)}
                      className={`${actionButtonClass} border-red-100 text-red-600 hover:bg-red-50`}
                      aria-label={`Delete ${row.title}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              )}
            />
          </div>
        ) : (
          <div className="mt-5">
            <DataTable
              rows={applications}
              columns={applicationColumns}
              getRowKey={(row) => row.id}
              searchPlaceholder="Search applications"
              searchText={(row) =>
                [
                  row.full_name,
                  row.email,
                  row.phone,
                  row.position,
                  row.current_location,
                  row.years_of_experience,
                ]
                  .filter(Boolean)
                  .join(' ')
              }
              emptyTitle="No applications yet"
              emptyDescription="Applications submitted from the Careers page will appear here."
              initialSortKey="applied"
              initialSortDirection="desc"
              horizontalScroll={false}
              mobileCard={({ row }) => (
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">{row.full_name}</h3>
                      <p className="mt-0.5 text-xs font-medium text-[#0753B8]">{row.position}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewingApplication(row)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#DCEBFA] bg-[#F2F7FF] px-3 py-1.5 text-xs font-bold text-[#0753B8]"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      View
                    </button>
                  </div>

                  <div className="mt-2 space-y-0.5 text-xs text-slate-500">
                    <p className="break-all">{row.email}</p>
                    <p>
                      {row.phone}
                      {row.current_location ? ` · ${row.current_location}` : ''}
                    </p>
                    <p>Applied {formatDateTime(row.created_at)}</p>
                  </div>
                </article>
              )}
            />
          </div>
        )}
      </div>

      {formOpen && (
        <JobOpeningForm
          key={editing?.id ?? 'new'}
          opening={editing}
          allowedUserId={allowedUserId}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSaved={refresh}
          onPublished={setPublishedJob}
        />
      )}

      <PublishSuccessDialog job={publishedJob} onClose={() => setPublishedJob(null)} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this opening?"
        description={`"${pendingDelete?.title ?? ''}" will be permanently removed from the Careers page. Applications already submitted are kept.`}
        confirmLabel="Delete opening"
        isProcessing={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />

      <ApplicationDetails
        open={Boolean(viewingApplication)}
        application={viewingApplication}
        onClose={() => setViewingApplication(null)}
      />
    </section>
  )
}