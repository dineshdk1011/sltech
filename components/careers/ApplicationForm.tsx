'use client'

import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from 'react'
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Upload,
  User,
  X,
} from 'lucide-react'

import FormInput from '@/components/FormInput'
import { createApplication, uploadResume } from '@/lib/careers'

import type { ApplicationMode, JobOpening } from './types'
import { primaryButtonClass, secondaryButtonClass } from './styles'
import {
  formatBytes,
  isValidEmail,
  isValidPhone,
  RESUME_ACCEPT_ATTR,
  validateResumeFile,
} from './utils'

type FormValues = {
  full_name: string
  email: string
  phone: string
  position: string
  years_of_experience: string
  current_location: string
  cover_letter: string
}

type SubmissionStatus = 'idle' | 'uploading' | 'submitting' | 'success'

export default function ApplicationForm({
  mode,
  opening,
  onCancel,
  onSubmitted,
}: {
  mode: ApplicationMode
  opening: JobOpening | null
  onCancel: () => void
  onSubmitted?: () => void
}) {
  const [values, setValues] = useState<FormValues>({
    full_name: '',
    email: '',
    phone: '',
    position: opening?.title ?? 'General Application',
    years_of_experience: '',
    current_location: '',
    cover_letter: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues | 'resume', string>>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState('')
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isBusy = status === 'uploading' || status === 'submitting'

  const updateValue =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: '' }))
    }

  const acceptFile = (file: File | null) => {
    if (!file) {
      setResumeFile(null)
      setResumeError('')
      return
    }

    const validationError = validateResumeFile(file)
    setResumeError(validationError ?? '')
    setResumeFile(validationError ? null : file)
    setErrors((current) => ({ ...current, resume: '' }))
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (isBusy) return
    acceptFile(event.dataTransfer.files?.[0] ?? null)
  }

  const validate = (): Partial<Record<keyof FormValues | 'resume', string>> => {
    const next: Partial<Record<keyof FormValues | 'resume', string>> = {}

    if (!values.full_name.trim()) next.full_name = 'Please enter your full name.'
    if (!values.email.trim()) next.email = 'Please enter your email address.'
    else if (!isValidEmail(values.email)) next.email = 'Please enter a valid email address.'
    if (!values.phone.trim()) next.phone = 'Please enter your phone number.'
    else if (!isValidPhone(values.phone)) next.phone = 'Please enter a valid phone number.'
    if (!values.position.trim()) next.position = 'Please enter the position you are applying for.'

    if (!resumeFile) next.resume = 'Please attach your resume (PDF, DOC or DOCX).'
    else next.resume = validateResumeFile(resumeFile) ?? undefined

    return next
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isBusy) return

    setSubmitError('')
    const nextErrors = validate()
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      return
    }

    const file = resumeFile as File
    setStatus('uploading')
    setUploadProgress(0)

    try {
      const upload = await uploadResume(file, setUploadProgress)
      setStatus('submitting')

      await createApplication({
        job_opening_id: opening?.id ?? null,
        job_title: opening?.title ?? '',
        position: values.position.trim(),
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        years_of_experience: values.years_of_experience.trim(),
        current_location: values.current_location.trim(),
        cover_letter: values.cover_letter.trim(),
        resume_path: upload.path,
        resume_filename: upload.fileName,
        resume_size: upload.size,
      })

      setStatus('success')
      onSubmitted?.()
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while submitting your application. Please try again.',
      )
      setStatus('idle')
      setUploadProgress(0)
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center" role="status" aria-live="polite">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF4FD] text-[#002B8B]">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
        </div>

        <h3 className="text-gradient-brand mt-5 text-xl font-extrabold">
          Application submitted successfully
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          Thank you, {values.full_name.trim().split(' ')[0] || 'there'}. Our team has received
          your application{mode === 'job' && opening ? ` for ${opening.title}` : ''} and your
          resume. We will review it and reach out if there is a match.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onCancel} className={primaryButtonClass}>
            Done
          </button>
          <button
            type="button"
            onClick={() => {
              setValues({
                full_name: '',
                email: '',
                phone: '',
                position: opening?.title ?? 'General Application',
                years_of_experience: '',
                current_location: '',
                cover_letter: '',
              })
              acceptFile(null)
              setErrors({})
              setStatus('idle')
              setSubmitError('')
            }}
            className={secondaryButtonClass}
          >
            Submit another application
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {mode === 'job' && opening && (
        <div className="flex items-start gap-3 rounded-xl border border-[#DCEBFA] bg-[#F2F7FF] px-4 py-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#002B8B]">
            <Briefcase className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#002B8B]">Applying for: {opening.title}</p>
            {[opening.department, opening.location, opening.employment_type].filter(Boolean)
              .length > 0 && (
              <p className="mt-0.5 text-xs text-slate-600">
                {[opening.department, opening.location, opening.employment_type]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormInput
          label="Full Name"
          name="full_name"
          required
          value={values.full_name}
          onChange={updateValue('full_name')}
          placeholder="Your full name"
          icon={User}
          error={errors.full_name}
          autoComplete="name"
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          required
          value={values.email}
          onChange={updateValue('email')}
          placeholder="you@example.com"
          icon={Mail}
          error={errors.email}
          autoComplete="email"
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          required
          value={values.phone}
          onChange={updateValue('phone')}
          placeholder="+91 00000 00000"
          icon={Phone}
          error={errors.phone}
          autoComplete="tel"
        />

        <FormInput
          label="Position Applying For"
          name="position"
          required
          value={values.position}
          onChange={updateValue('position')}
          placeholder="Position or area of interest"
          icon={Briefcase}
          error={errors.position}
          readOnly={mode === 'job' && Boolean(opening)}
        />

        <FormInput
          label="Years of Experience"
          name="years_of_experience"
          value={values.years_of_experience}
          onChange={updateValue('years_of_experience')}
          placeholder="e.g. 3 years"
          icon={Clock}
        />

        <FormInput
          label="Current Location"
          name="current_location"
          value={values.current_location}
          onChange={updateValue('current_location')}
          placeholder="City, State"
          icon={MapPin}
        />
      </div>

      <FormInput
        fieldType="textarea"
        label="Cover Letter / About Yourself"
        name="cover_letter"
        value={values.cover_letter}
        onChange={updateValue('cover_letter')}
        placeholder="Tell us briefly about your experience and why you would like to join SL Laundry Tech."
        icon={MessageSquare}
      />

      <div>
        <p className="text-sm font-medium text-slate-700">
          Resume <span className="text-red-500">*</span>
        </p>

        <div
          onDragOver={(event) => {
            event.preventDefault()
            if (!isBusy) setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mt-1.5 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-colors ${
            isDragging
              ? 'border-[#1268D8] bg-[#F2F7FF]'
              : 'border-slate-200 bg-[#F9FCFF] hover:border-[#CFE5FA]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept={RESUME_ACCEPT_ATTR}
            onChange={(event) => acceptFile(event.target.files?.[0] ?? null)}
            disabled={isBusy}
          />

          {resumeFile ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:text-left">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EAF4FD] text-[#002B8B]">
                  <FileText className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-slate-500">{formatBytes(resumeFile.size)}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isBusy}
                  className="rounded-lg px-2 py-1.5 text-xs font-semibold text-[#0753B8] transition-colors hover:text-[#002B8B] disabled:opacity-60"
                >
                  Replace
                </button>
                <button
                  type="button"
                  aria-label="Remove resume"
                  onClick={() => acceptFile(null)}
                  disabled={isBusy}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              className="flex w-full flex-col items-center gap-2 rounded-lg py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#002B8B]/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4FD] text-[#002B8B]">
                <Upload className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="text-sm text-slate-600">
                <span className="font-semibold text-[#002B8B]">Click to upload</span> or drag and
                drop your resume
              </span>
              <span className="text-xs text-slate-500">PDF, DOC or DOCX · up to 5 MB</span>
            </button>
          )}
        </div>

        {(resumeError || errors.resume) && (
          <p role="alert" className="mt-1.5 text-xs text-red-500">
            {resumeError || errors.resume}
          </p>
        )}

        {isBusy && (
          <div className="mt-3" aria-live="polite">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <LoaderCircle
                  className="h-3.5 w-3.5 animate-spin text-[#1268D8]"
                  aria-hidden="true"
                />
                {status === 'uploading' ? 'Uploading resume…' : 'Saving your application…'}
              </span>
              {status === 'uploading' && <span>{uploadProgress}%</span>}
            </div>
            <div
              className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={status === 'uploading' ? uploadProgress : undefined}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#002B8B] via-[#0753B8] to-[#1268D8] transition-all duration-300"
                style={{ width: `${status === 'uploading' ? uploadProgress : 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-500">
          Fields marked <span className="text-red-500">*</span> are required. Your details are used
          only for recruitment.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className={`${secondaryButtonClass} w-full sm:w-auto`}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className={`${primaryButtonClass} w-full sm:w-auto`}
          >
            {isBusy ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Upload className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
            )}
            {isBusy ? 'Submitting…' : 'Submit Application'}
          </button>
        </div>
      </div>
    </form>
  )
}