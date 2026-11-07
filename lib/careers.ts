import { createClient } from '@/lib/supabase/client'
import type {
  JobApplication,
  JobApplicationInput,
  JobOpening,
  JobOpeningInput,
  JobStatus,
  ResumeUploadResult,
} from '@/components/careers/types'
import { buildResumePath, RESUME_BUCKET } from '@/components/careers/utils'

export const JOB_OPENINGS_TABLE = 'job_openings'
export const JOB_APPLICATIONS_TABLE = 'job_applications'

function toError(error: unknown, fallback: string): Error {
  if (error instanceof Error) return error
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message: unknown }).message)
      : fallback
  return new Error(message || fallback)
}

/**
 * Published openings only. Used by the public /careers page — the RLS policy
 * `job_openings_public_read` scopes this so drafts/closed rows are never leaked
 * to anonymous visitors.
 */
export async function fetchPublishedJobs(): Promise<JobOpening[]> {
  const { data, error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw toError(error, 'Could not load open positions.')
  return (data ?? []) as JobOpening[]
}

/** Every opening (drafts, published, closed). Admin-only via RLS. */
export async function fetchAllJobs(): Promise<JobOpening[]> {
  const { data, error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw toError(error, 'Could not load job openings.')
  return (data ?? []) as JobOpening[]
}

export async function createJob(
  input: JobOpeningInput,
  allowedUserId: number | string | null,
): Promise<void> {
  const { error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .insert({
      ...input,
      created_by: allowedUserId == null ? null : Number(allowedUserId),
      published_at: input.status === 'published' ? new Date().toISOString() : null,
    })

  if (error) throw toError(error, 'Could not create the job opening.')
}

export async function updateJob(
  id: string,
  input: JobOpeningInput,
  currentStatus: JobStatus | string,
): Promise<void> {
  // `.select('id')` returns the rows that were actually changed. When RLS blocks
  // an UPDATE, PostgREST reports success with zero rows, so we must check it.
  const { data, error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .update({
      ...input,
      published_at:
        input.status === 'published' && currentStatus !== 'published'
          ? new Date().toISOString()
          : undefined,
    })
    .eq('id', id)
    .select('id')

  if (error) throw toError(error, 'Could not update the job opening.')
  if (!data || data.length === 0) {
    throw new Error(
      'The opening was not updated. You may not have permission to edit job openings.',
    )
  }
}

export async function setJobStatus(id: string, status: JobStatus): Promise<void> {
  const { data, error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .update({
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .select('id')

  if (error) throw toError(error, 'Could not change the opening status.')
  if (!data || data.length === 0) {
    throw new Error(
      'The opening status was not changed. You may not have permission to edit job openings.',
    )
  }
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await createClient()
    .from(JOB_OPENINGS_TABLE)
    .delete()
    .eq('id', id)

  if (error) throw toError(error, 'Could not delete the job opening.')
}

export async function fetchApplications(): Promise<JobApplication[]> {
  const { data, error } = await createClient()
    .from(JOB_APPLICATIONS_TABLE)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw toError(error, 'Could not load applications.')
  return (data ?? []) as JobApplication[]
}

export async function createApplication(input: JobApplicationInput): Promise<void> {
  const { error } = await createClient()
    .from(JOB_APPLICATIONS_TABLE)
    .insert(input)

  if (error) throw toError(error, 'Could not submit your application.')
}

/**
 * Uploads a resume to the private `resumes` bucket. Progress is reported with
 * XMLHttpRequest because the supabase-js progress callback is not exposed in
 * every environment — this keeps the upload progress UI reliable.
 */
export async function uploadResume(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ResumeUploadResult> {
  const supabase = createClient()
  const path = buildResumePath(file.name)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Resume upload is not configured. Please contact the administrator.')
  }

  const endpoint = `${supabaseUrl}/storage/v1/object/${RESUME_BUCKET}/${encodeURI(path)}`

  // storage-js sends the raw file body, so we mirror that here (and we can then
  // surface real byte-level progress, which the installed storage-js cannot).
  const contentType =
    {
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }[path.split('.').pop()?.toLowerCase() ?? ''] ||
    file.type ||
    'application/octet-stream'

  await new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', endpoint, true)
    request.setRequestHeader(
      'Authorization',
      `Bearer ${session?.access_token ?? supabaseKey}`,
    )
    request.setRequestHeader('apikey', supabaseKey)
    request.setRequestHeader('Content-Type', contentType)
    request.setRequestHeader('x-upsert', 'false')
    request.setRequestHeader('cache-control', '3600')

    request.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)))
    }

    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        onProgress?.(100)
        resolve()
        return
      }

      let message = 'Could not upload your resume.'
      try {
        const parsed = JSON.parse(request.responseText) as { message?: string }
        if (parsed.message) message = parsed.message
      } catch {
        // keep the fallback message
      }
      reject(new Error(message))
    }

    request.onerror = () => reject(new Error('Network error while uploading your resume.'))

    request.send(file)
  })

  return { path, fileName: file.name, size: file.size }
}

/** Admins can preview/download a private resume via a short-lived signed URL. */
export async function getResumeSignedUrl(
  path: string,
  downloadName?: string | null,
  expiresIn = 600,
): Promise<string> {
  const { data, error } = await createClient()
    .storage.from(RESUME_BUCKET)
    .createSignedUrl(path, expiresIn, downloadName ? { download: downloadName } : undefined)

  if (error || !data?.signedUrl) {
    throw toError(error, 'Could not create a download link for this resume.')
  }

  return data.signedUrl
}