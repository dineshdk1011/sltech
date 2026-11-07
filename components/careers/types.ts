export type JobStatus = 'draft' | 'published' | 'closed'

export const JOB_STATUSES: JobStatus[] = ['draft', 'published', 'closed']

export interface JobOpening {
  id: string
  title: string
  department: string | null
  location: string | null
  employment_type: string | null
  experience: string | null
  short_description: string | null
  full_description: string | null
  responsibilities: string | null
  requirements: string | null
  status: JobStatus | string
  created_by: number | string | null
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type JobOpeningInput = {
  title: string
  department: string
  location: string
  employment_type: string
  experience: string
  short_description: string
  full_description: string
  responsibilities: string
  requirements: string
  status: JobStatus
}

export interface JobApplication {
  id: string
  job_opening_id: string | null
  job_title: string | null
  position: string
  full_name: string
  email: string
  phone: string
  years_of_experience: string | null
  current_location: string | null
  cover_letter: string | null
  resume_path: string
  resume_filename: string | null
  resume_size: number | null
  status: string
  created_at: string | null
}

export type JobApplicationInput = {
  job_opening_id: string | null
  job_title: string
  position: string
  full_name: string
  email: string
  phone: string
  years_of_experience: string
  current_location: string
  cover_letter: string
  resume_path: string
  resume_filename: string
  resume_size: number
}

export interface ResumeUploadResult {
  path: string
  fileName: string
  size: number
}

export type ApplicationMode = 'job' | 'general'