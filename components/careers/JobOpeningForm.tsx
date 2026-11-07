'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { AlertCircle, LoaderCircle, Save } from 'lucide-react'

import FormInput from '@/components/FormInput'
import { createJob, updateJob } from '@/lib/careers'

import CareersModal from './CareersModal'
import { departmentOptions, employmentTypeOptions } from './content'
import type { PublishedJobSummary } from './PublishSuccessDialog'
import type { JobOpening, JobOpeningInput, JobStatus } from './types'
import { primaryButtonClass, secondaryButtonClass } from './styles'
import { formatDateTime } from './utils'

const emptyOpening = (): JobOpeningInput => ({
  title: '',
  department: '',
  location: '',
  employment_type: '',
  experience: '',
  short_description: '',
  full_description: '',
  responsibilities: '',
  requirements: '',
  status: 'draft',
})

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' },
]

const departmentSelectOptions = [
  { value: '', label: 'Not specified' },
  ...departmentOptions.map((value) => ({ value, label: value })),
]

const employmentSelectOptions = [
  { value: '', label: 'Not specified' },
  ...employmentTypeOptions.map((value) => ({ value, label: value })),
]

const toFormValues = (opening: JobOpening): JobOpeningInput => ({
  title: opening.title ?? '',
  department: opening.department ?? '',
  location: opening.location ?? '',
  employment_type: opening.employment_type ?? '',
  experience: opening.experience ?? '',
  short_description: opening.short_description ?? '',
  full_description: opening.full_description ?? '',
  responsibilities: opening.responsibilities ?? '',
  requirements: opening.requirements ?? '',
  status: (opening.status as JobStatus) ?? 'draft',
})

export default function JobOpeningForm({
  opening,
  allowedUserId,
  onClose,
  onSaved,
  onPublished,
}: {
  opening: JobOpening | null
  allowedUserId: number | string | null
  onClose: () => void
  onSaved: () => void | Promise<void>
  onPublished?: (job: PublishedJobSummary) => void
}) {
  // The parent remounts this form with a `key` per opening, so initialising
  // from props here is enough — no state-setting effect required.
  const [values, setValues] = useState<JobOpeningInput>(() =>
    opening ? toFormValues(opening) : emptyOpening(),
  )
  const [titleError, setTitleError] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const isEditing = Boolean(opening)

  const updateValue =
    (field: keyof JobOpeningInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
      if (field === 'title') setTitleError('')
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return

    setError('')

    if (!values.title.trim()) {
      setTitleError('Please enter a job title.')
      return
    }

    setIsSaving(true)

    try {
      if (opening) {
        await updateJob(opening.id, values, opening.status)
      } else {
        await createJob(values, allowedUserId)
      }

      await onSaved()

      // Celebrate only when the opening actually went live with this save.
      if (values.status === 'published' && opening?.status !== 'published') {
        onPublished?.({
          title: values.title.trim(),
          department: values.department.trim() || null,
          location: values.location.trim() || null,
          employment_type: values.employment_type.trim() || null,
          experience: values.experience.trim() || null,
          short_description: values.short_description.trim() || null,
          published_at: new Date().toISOString(),
        })
      }

      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not save the job opening. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <CareersModal
      open
      onClose={isSaving ? () => undefined : onClose}
      title={isEditing ? 'Edit opening' : 'Add new opening'}
      description={
        isEditing
          ? 'Update the details of this job opening and its publishing status.'
          : 'Create a new job opening. You can keep it as a draft and publish it later.'
      }
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            {isEditing && opening
              ? `Created ${formatDateTime(opening.created_at)} · Updated ${formatDateTime(opening.updated_at)}`
              : 'Fields marked * are required.'}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className={`${secondaryButtonClass} w-full sm:w-auto`}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="job-opening-form"
              disabled={isSaving}
              className={`${primaryButtonClass} w-full sm:w-auto`}
            >
              {isSaving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
              )}
              {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Create opening'}
            </button>
          </div>
        </div>
      }
    >

      <form id="job-opening-form" onSubmit={handleSubmit} noValidate className="space-y-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <FormInput
          label="Job title"
          name="title"
          required
          value={values.title}
          onChange={updateValue('title')}
          placeholder="e.g. Service Engineer"
          error={titleError}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            fieldType="select"
            label="Department"
            name="department"
            value={values.department}
            onChange={updateValue('department')}
            options={departmentSelectOptions}
          />

          <FormInput
            label="Location"
            name="location"
            value={values.location}
            onChange={updateValue('location')}
            placeholder="e.g. Tiruppur, Tamil Nadu"
          />

          <FormInput
            fieldType="select"
            label="Employment type"
            name="employment_type"
            value={values.employment_type}
            onChange={updateValue('employment_type')}
            options={employmentSelectOptions}
          />

          <FormInput
            label="Experience required"
            name="experience"
            value={values.experience}
            onChange={updateValue('experience')}
            placeholder="e.g. 2–4 years"
          />

          <FormInput
            fieldType="select"
            label="Status"
            name="status"
            value={values.status}
            onChange={updateValue('status')}
            options={statusOptions}
          />
        </div>

        <FormInput
          fieldType="textarea"
          label="Short description"
          name="short_description"
          value={values.short_description}
          onChange={updateValue('short_description')}
          placeholder="A one or two line summary shown on the job card."
        />

        <FormInput
          fieldType="textarea"
          label="Full description"
          name="full_description"
          value={values.full_description}
          onChange={updateValue('full_description')}
          placeholder="Describe the role, team and working environment."
        />

        <FormInput
          fieldType="textarea"
          label="Responsibilities"
          name="responsibilities"
          value={values.responsibilities}
          onChange={updateValue('responsibilities')}
          placeholder="Enter one responsibility per line."
        />

        <FormInput
          fieldType="textarea"
          label="Requirements / skills"
          name="requirements"
          value={values.requirements}
          onChange={updateValue('requirements')}
          placeholder="Enter one requirement per line — each line becomes a skill tag on the listing."
        />
      </form>
    </CareersModal>
  )
}