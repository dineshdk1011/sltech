import type { JobOpening } from './types'

export const RESUME_BUCKET = 'resumes'

// 5 MB matches the storage bucket limit configured in supabase/careers_setup.sql
export const MAX_RESUME_BYTES = 5 * 1024 * 1024

export const ACCEPTED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const
export const ACCEPTED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const

export const RESUME_ACCEPT_ATTR = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.toLowerCase().split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export function validateResumeFile(file: File): string | null {
  const extension = getFileExtension(file.name)
  const extensionOk = (ACCEPTED_RESUME_EXTENSIONS as readonly string[]).includes(extension)
  const mimeOk =
    !file.type || (ACCEPTED_RESUME_MIME_TYPES as readonly string[]).includes(file.type)

  if (!extensionOk && !mimeOk) {
    return 'Please upload your resume as a PDF, DOC or DOCX file.'
  }

  if (file.size === 0) {
    return 'That file appears to be empty. Please choose another resume file.'
  }

  if (file.size > MAX_RESUME_BYTES) {
    return `Resume must be ${formatBytes(MAX_RESUME_BYTES)} or smaller (yours is ${formatBytes(file.size)}).`
  }

  return null
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 13
}

// Splits a free-text field into list items. Supports newlines, bullets (•, -, *)
// and semicolons so admins can paste either plain lines or bulleted text.
export function parseList(value: string | null | undefined): string[] {
  if (!value) return []

  return value
    .split(/\r?\n|;|•/)
    .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter((line) => line.length > 0)
}

export function jobMeta(opening: JobOpening): Array<{ label: string; value: string }> {
  return [
    { label: 'Department', value: opening.department ?? '' },
    { label: 'Location', value: opening.location ?? '' },
    { label: 'Employment type', value: opening.employment_type ?? '' },
    { label: 'Experience', value: opening.experience ?? '' },
  ].filter((item) => item.value.trim().length > 0)
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Detects "table does not exist yet" responses so the UI can show a friendly
 * "careers module not set up" message instead of a raw PostgREST error. Triggered
 * until supabase/careers_setup.sql has been run.
 */
export function isMissingSchemaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false

  const code = 'code' in error ? String((error as { code?: unknown }).code ?? '') : ''
  const message =
    'message' in error ? String((error as { message?: unknown }).message ?? '') : ''

  return (
    code === 'PGRST205' ||
    code === '42P01' ||
    /schema cache/i.test(message) ||
    /could not find the table/i.test(message) ||
    /does not exist/i.test(message)
  )
}

export function buildResumePath(fileName: string): string {
  const extension = getFileExtension(fileName) || 'pdf'
  const safeName = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .toLowerCase()

  const unique =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return `${new Date().toISOString().slice(0, 10)}/${unique}${safeName ? `-${safeName}` : ''}.${extension}`
}