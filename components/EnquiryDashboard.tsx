'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, LogOut, Mail, MapPin, MessageSquare, Phone, Search, UserRound } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import ErrorScreen from './enquiry-dashboard/ErrorScreen'
import { sortOptionsDefaults, summaryCardsDefaults, tableColumnsDefaults } from './enquiry-dashboard/defaults'
import LoginScreen from './enquiry-dashboard/LoginScreen'
import MobileEnquiryCard from './enquiry-dashboard/MobileEnquiryCard'
import PermissionDeniedScreen from './enquiry-dashboard/PermissionDeniedScreen'
import SortableHeader from './enquiry-dashboard/SortableHeader'
import StatusBadge from './enquiry-dashboard/StatusBadge'
import StatusScreen from './enquiry-dashboard/StatusScreen'
import SummaryCard from './enquiry-dashboard/SummaryCard'
import { getDate, getLocation, getSortValue, getStatus, getText, type EnquiryRecord, type SortColumn, type SortDirection } from './enquiry-dashboard/utils'
import { useCurrentUser } from './UserContext'

type ViewState = 'checking' | 'login' | 'denied' | 'dashboard' | 'error'

const MAX_SESSION_MS = 30 * 60 * 1000
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000
const SESSION_KEYS = ['enquiry_auth', 'enquiry_auth_user', 'enquiry_authenticated_at', 'enquiry_last_activity'] as const

const clearApplicationSession = (): void => {
  SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key))
}

const sessionEncryptionKeyPromise = crypto.subtle.generateKey(
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt'],
)

const encryptSessionUser = async (user: { email: string; authenticatedAt: number }): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedUser = new TextEncoder().encode(JSON.stringify(user))
  const key = await sessionEncryptionKeyPromise
  const encryptedUser = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedUser)
  const encryptedBytes = new Uint8Array(encryptedUser)
  const payload = new Uint8Array(iv.length + encryptedBytes.length)
  payload.set(iv)
  payload.set(encryptedBytes, iv.length)
  return btoa(String.fromCharCode(...payload))
}

export default function EnquiryDashboard() {
  const { authUser, allowedUser, allowedUserError, email, loading } =
    useCurrentUser()
  const [viewState, setViewState] = useState<ViewState>('checking')
  const [userEmail, setUserEmail] = useState('')
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sortColumn, setSortColumn] = useState<SortColumn>('received')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    if (loading) return

    let isMounted = true
    let timeoutInterval: number | undefined

    const signOutAndClear = async (): Promise<void> => {
      if (isSupabaseConfigured()) {
        await createClient().auth.signOut()
      }
      clearApplicationSession()
    }

    const showLogin = (): void => {
      if (!isMounted) return
      setUserEmail('')
      setViewState('login')
    }

    const checkSessionTimeout = async (): Promise<void> => {
      const authenticatedAt = Number(sessionStorage.getItem('enquiry_authenticated_at'))
      const lastActivity = Number(sessionStorage.getItem('enquiry_last_activity'))
      const now = Date.now()

      if (!authenticatedAt || now - authenticatedAt >= MAX_SESSION_MS || !lastActivity || now - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        await signOutAndClear()
        showLogin()
      }
    }

    const initialize = async (): Promise<void> => {
      if (!isSupabaseConfigured() || !authUser) {
        clearApplicationSession()
        showLogin()
        return
      }

      const supabase = createClient()

      if (!email) {
        await signOutAndClear()
        if (isMounted) setViewState('denied')
        return
      }

      setUserEmail(email)
      if (allowedUserError) {
        await signOutAndClear()
        if (isMounted) {
          setErrorMessage('We could not verify your dashboard access. Please check the allowed_users access policy.')
          setViewState('error')
        }
        return
      }

      const isActive = allowedUser?.is_active === true || String(allowedUser?.is_active).toLowerCase() === 'true'
      if (!allowedUser || !isActive) {
        await signOutAndClear()
        if (isMounted) setViewState('denied')
        return
      }

      const authenticatedAt = Number(sessionStorage.getItem('enquiry_authenticated_at')) || Date.now()
      const lastActivity = Number(sessionStorage.getItem('enquiry_last_activity')) || Date.now()
      const encryptedUser = await encryptSessionUser({ email, authenticatedAt })
      sessionStorage.setItem('enquiry_auth', 'true')
      sessionStorage.setItem('enquiry_auth_user', encryptedUser)
      sessionStorage.setItem('enquiry_authenticated_at', authenticatedAt.toString())
      sessionStorage.setItem('enquiry_last_activity', lastActivity.toString())

      if (Date.now() - authenticatedAt >= MAX_SESSION_MS || Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        await signOutAndClear()
        showLogin()
        return
      }

      const { data, error: enquiryError } = await supabase.from('enquiry').select('*').order('created_at', { ascending: false })
      if (!isMounted) return
      if (enquiryError) {
        setErrorMessage('Could not load enquiries. Please try again.')
        setViewState('error')
        return
      }

      setEnquiries(data ?? [])
      setViewState('dashboard')
      timeoutInterval = window.setInterval(() => { void checkSessionTimeout() }, 1000)
    }

    void initialize()

    return () => {
      isMounted = false
      if (timeoutInterval) window.clearInterval(timeoutInterval)
    }
  }, [authUser, allowedUser, allowedUserError, email, loading])

  useEffect(() => {
    if (viewState !== 'dashboard') return

    const updateActivity = (): void => {
      sessionStorage.setItem('enquiry_last_activity', Date.now().toString())
    }
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'] as const
    activityEvents.forEach((eventName) => window.addEventListener(eventName, updateActivity))

    return () => activityEvents.forEach((eventName) => window.removeEventListener(eventName, updateActivity))
  }, [viewState])

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matchingEnquiries = query
      ? enquiries.filter((enquiry) => [
        enquiry.name,
        enquiry.contact,
        enquiry.email,
        enquiry.enquiry_type,
        enquiry.enquiry,
        enquiry.address,
        enquiry.state,
        enquiry.district,
        enquiry.last_update,
        getStatus(enquiry),
      ].some((value) => getText(value).toLowerCase().includes(query)))
      : enquiries

    return [...matchingEnquiries].sort((left, right) => {
      const leftValue = getSortValue(left, sortColumn)
      const rightValue = getSortValue(right, sortColumn)
      const comparison = typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), undefined, { numeric: true, sensitivity: 'base' })
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [enquiries, search, sortColumn, sortDirection])

  const handleSort = (column: SortColumn): void => {
    if (sortColumn === column) {
      setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const handleLogout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      await supabase.auth.signOut()
    }
    clearApplicationSession()
    setUserEmail('')
    setViewState('login')
  }

  if (viewState === 'checking') return <StatusScreen title="Checking access..." />
  if (viewState === 'login') return <LoginScreen />
  if (viewState === 'denied') return <PermissionDeniedScreen email={userEmail} />
  if (viewState === 'error') return <ErrorScreen message={errorMessage} onLogout={handleLogout} />

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pageStart = filteredEnquiries.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1
  const pageEnd = Math.min(safeCurrentPage * pageSize, filteredEnquiries.length)
  const paginatedEnquiries = filteredEnquiries.slice(pageStart - 1, pageEnd)

  const latestDate = enquiries.reduce<string | null>((latest, enquiry) => {
    const submittedAt = enquiry.created_at
    if (!submittedAt) return latest
    if (!latest || new Date(String(submittedAt)) > new Date(latest)) return String(submittedAt)
    return latest
  }, null)

  const summaryCards = summaryCardsDefaults.map((card) => ({
    ...card,
    icon: card.label === 'Total enquiries' ? <MessageSquare /> : <CheckCircle2 />,
    value: card.label === 'Total enquiries'
      ? enquiries.length
      : card.label === 'Showing now'
        ? paginatedEnquiries.length
        : enquiries.filter((item) => item.is_converted === true).length,
  }))

  const tableColumns = tableColumnsDefaults
  const sortOptions = sortOptionsDefaults

  const renderTableRow = (enquiry: EnquiryRecord, index: number) => (
    <tr key={String(enquiry.id ?? `${getText(enquiry.email)}-${pageStart + index}`)} className="align-top transition-colors hover:bg-[#f8fbff]">
      <td className="wrap-break-word px-4 py-4 align-top lg:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf4fd] text-[#125FD0]">
            <UserRound className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold leading-5 text-slate-900">{getText(enquiry.name)}</p>
            <a className="mt-1 flex items-start gap-1 wrap-break-word text-xs leading-4 text-slate-500 hover:text-[#125FD0]" href={`tel:${getText(enquiry.contact)}`}>
              <Phone className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{getText(enquiry.contact)}</span>
            </a>
            {getText(enquiry.email) !== '—' && (
              <a className="mt-1 flex items-start gap-1 break-all text-xs leading-4 text-slate-500 hover:text-[#125FD0]" href={`mailto:${getText(enquiry.email)}`}>
                <Mail className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{getText(enquiry.email)}</span>
              </a>
            )}
          </div>
        </div>
      </td>
      <td className="wrap-break-word px-4 py-4 align-top lg:px-5">
        <p className="font-medium leading-5 text-slate-700">{getText(enquiry.enquiry_type)}</p>
        <p className="mt-1 wrap-break-word text-xs leading-5 text-slate-500" title={getText(enquiry.enquiry)}>{getText(enquiry.enquiry)}</p>
        {getText(enquiry.last_update) !== '—' && (
          <p className="mt-2 wrap-break-word text-xs leading-4 text-slate-400">Update: {getText(enquiry.last_update)}</p>
        )}
      </td>
      <td className="wrap-break-word px-4 py-4 align-top lg:px-5">
        <span className="flex items-start gap-1.5 leading-5 text-slate-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#125FD0]" />
          <span className="min-w-0 wrap-break-word">
            {getLocation(enquiry)}
            <span className="mt-1 block wrap-break-word text-xs leading-4 text-slate-400">{getText(enquiry.address)}</span>
          </span>
        </span>
      </td>
      <td className="wrap-break-word px-4 py-4 align-top lg:px-5"><StatusBadge status={getStatus(enquiry)} /></td>
      <td className="px-4 py-4 align-top leading-5 text-slate-500 lg:px-5">{getDate(enquiry.created_at)}</td>
    </tr>
  )

  return (
    <main className="bg-[#f6f9fc] px-3 py-8 md:px-7 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-gradient-brand mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
              <span className="h-2 w-2 rounded-full bg-[#125FD0]" />Enquiry centre
            </div>
            <h1 className="text-gradient-brand text-3xl font-extrabold tracking-tight md:text-4xl">Customer enquiries</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Review incoming requirements and follow up with businesses looking for laundry solutions.</p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-4 md:w-auto md:items-end">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4 text-[#125FD0]" />
              {latestDate ? `Latest ${getDate(latestDate)}` : 'No submissions yet'}
            </div>
            <button type="button" onClick={() => { void handleLogout() }} className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-[#125FD0] hover:text-[#125FD0]">
              <LogOut className="h-4 w-4" />Log out
            </button>
          </div>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-3" aria-label="Enquiry summary">
          {summaryCards.map(({ icon, label, value }) => (
            <SummaryCard key={label} icon={icon} label={label} value={value} />
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,43,77,0.05)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-gradient-brand text-lg font-bold">All submissions</h2>
              <p className="mt-1 text-sm text-slate-500">Showing {pageStart}–{pageEnd} of {filteredEnquiries.length} enquiries</p>
            </div>
            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">Search enquiries</span>
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center"><Search className="h-4 w-4 text-slate-400" /></span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }}
                  placeholder="Search enquiries"
                  className="enquiry-search-input h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 text-sm leading-5 text-slate-900 outline-none transition focus:border-[#125FD0] focus:bg-white focus:ring-2 focus:ring-[#125FD0]/10"
                />
              </label>
              <div className="flex w-full items-center gap-2 md:hidden">
                <label className="flex min-w-0 flex-1 items-center gap-2">
                  <span className="shrink-0 text-xs font-semibold text-slate-500">Sort by</span>
                  <select value={sortColumn} onChange={(event) => handleSort(event.target.value as SortColumn)} aria-label="Sort enquiries by" className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-[#125FD0] focus:bg-white focus:ring-2 focus:ring-[#125FD0]/10">
                    {sortOptions.map(({ label, value }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => { setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc')); setCurrentPage(1) }} aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#125FD0]/30">
                  <span className="sr-only">{sortDirection === 'asc' ? 'Ascending' : 'Descending'}</span>
                  {sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-300" />
              <h3 className="text-gradient-brand mt-3 font-semibold">No enquiries found</h3>
              <p className="mt-1 text-sm text-slate-500">Try a different name, business, service, or location.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 p-3 md:hidden">
                {paginatedEnquiries.map((enquiry, index) => (
                  <MobileEnquiryCard key={String(enquiry.id ?? `${getText(enquiry.email)}-${pageStart + index}`)} enquiry={enquiry} />
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full table-fixed text-left text-sm">
                  <colgroup>
                    <col className="w-[25%]" />
                    <col className="w-[25%]" />
                    <col className="w-[20%]" />
                    <col className="w-[18%]" />
                    <col className="w-[12%]" />
                  </colgroup>
                  <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      {tableColumns.map(({ label, column }) => (
                        <SortableHeader key={column} label={label} column={column} sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort} />
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedEnquiries.map(renderTableRow)}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {filteredEnquiries.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>Showing {pageStart}–{pageEnd} of {filteredEnquiries.length} enquiries</p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <span className="sr-only">Rows per page</span>
                  <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1) }} className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-[#125FD0] focus:ring-2 focus:ring-[#125FD0]/10">
                    <option value="5">5 / page</option>
                    <option value="10">10 / page</option>
                    <option value="25">25 / page</option>
                  </select>
                </label>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Previous page" disabled={safeCurrentPage === 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-16 text-center text-xs font-medium text-slate-600">{safeCurrentPage} / {totalPages}</span>
                  <button type="button" aria-label="Next page" disabled={safeCurrentPage === totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#125FD0] hover:text-[#125FD0] disabled:cursor-not-allowed disabled:opacity-40">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}