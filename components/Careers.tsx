'use client'

import { useCallback, useEffect, useState } from 'react'

import { fetchPublishedJobs } from '@/lib/careers'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { useCurrentUser } from '@/components/UserContext'

import AdminCareersPanel from './careers/AdminCareersPanel'
import ApplicationForm from './careers/ApplicationForm'
import CareersHero from './careers/CareersHero'
import CareersModal from './careers/CareersModal'
import GeneralResumeCta from './careers/GeneralResumeCta'
import JobOpeningsSection from './careers/JobOpeningsSection'
import type { ApplicationMode, JobOpening } from './careers/types'
import { isMissingSchemaError } from './careers/utils'

type ActiveApplication = {
  mode: ApplicationMode
  opening: JobOpening | null
}

export default function Careers() {
  const { authUser, allowedUser, allowedUserError, allowedUserId } = useCurrentUser()

  const [openings, setOpenings] = useState<JobOpening[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [setupRequired, setSetupRequired] = useState(false)
  const [activeApplication, setActiveApplication] = useState<ActiveApplication | null>(null)

  // Same authorization rule the rest of the app uses (Header / dashboards):
  // a signed-in Supabase Auth user whose email maps to an active allowed_users row.
  const isAuthorized = Boolean(
    authUser &&
    allowedUser &&
    !allowedUserError &&
    (allowedUser.is_active === true ||
      String(allowedUser.is_active).toLowerCase() === 'true'),
  )

  const loadOpenings = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')
    setSetupRequired(false)

    if (!isSupabaseConfigured()) {
      setSetupRequired(true)
      setErrorMessage(
        'Our careers listings are being finalised. Please check back shortly — you can still submit your resume below.',
      )
      setIsLoading(false)
      return
    }

    try {
      setOpenings(await fetchPublishedJobs())
    } catch (error) {
      const missing = isMissingSchemaError(error)
      setSetupRequired(missing)
      setErrorMessage(
        missing
          ? 'Our careers listings are being finalised. Please check back shortly — you can still submit your resume below.'
          : error instanceof Error
            ? error.message
            : 'We could not load the open positions right now.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Deferred to a task so the initial load never calls setState synchronously
    // inside the effect body (react-hooks/set-state-in-effect).
    const timer = window.setTimeout(() => {
      void loadOpenings()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadOpenings])

  const openApplication = (opening: JobOpening | null) =>
    setActiveApplication({ mode: opening ? 'job' : 'general', opening })

  const closeApplication = () => setActiveApplication(null)

  const scrollToPositions = () =>
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const isJobApplication = activeApplication?.mode === 'job' && Boolean(activeApplication.opening)

  // NOTE: deliberately no `isolate` on this root wrapper.
  // CareersModal renders a `fixed z-[200]` dialog from inside this subtree. Adding
  // `isolate` (`isolation: isolate`) here creates a new stacking context, which traps
  // that dialog's z-index so the page <Footer> (a later `position: relative` sibling)
  // paints on top of the form. Keeping this wrapper non-isolating lets the dialog
  // resolve its z-index against the root stacking context and sit above the footer.
  // `relative` + `overflow-hidden` are still enough to anchor/clip the background layers.
  return (
    <div className="relative overflow-hidden pb-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
        style={{ backgroundImage: "url('/Careers-BG.png')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-white/60" />

      <div className="relative mx-auto max-w-[1400px] px-3 py-4 sm:px-5 lg:px-8 lg:py-6">
        <CareersHero onSubmitResume={() => openApplication(null)} />
        {
          !isAuthorized && <JobOpeningsSection
            openings={openings}
            isLoading={isLoading}
            errorMessage={errorMessage}
            setupRequired={setupRequired}
            onApply={(opening) => openApplication(opening)}
            onRetry={() => void loadOpenings()}
            onSubmitResume={() => openApplication(null)}
          />
        }


        <GeneralResumeCta
          onSubmitResume={() => openApplication(null)}
          onViewPositions={scrollToPositions}
        />

        {isAuthorized && (
          <AdminCareersPanel
            allowedUserId={allowedUserId}
            onOpeningsChanged={() => void loadOpenings()}
          />
        )}

        <CareersModal
          open={Boolean(activeApplication)}
          onClose={closeApplication}
          title={
            isJobApplication && activeApplication?.opening
              ? `Apply for ${activeApplication.opening.title}`
              : 'Submit your resume'
          }
          description={
            isJobApplication
              ? 'Complete the form below and attach your resume. Fields marked * are required.'
              : 'Share your details and resume and we will keep you in mind for future opportunities.'
          }
        >
          {activeApplication && (
            <ApplicationForm
              mode={activeApplication.mode}
              opening={activeApplication.opening}
              onCancel={closeApplication}
              onSubmitted={() => void loadOpenings()}
            />
          )}
        </CareersModal>
      </div>
    </div>
  )
}