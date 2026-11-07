export const SubmitToast = () => (
  <div role="status" aria-live="polite" className="fixed right-6 top-6 z-50 w-full max-w-sm rounded-xl border px-4 py-3.5 shadow-[0_10px_30px_rgba(0,43,139,0.12)]" style={{ backgroundColor: 'var(--toast-bg)', borderColor: 'var(--toast-border)' }}>
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--toast-icon-bg)' }}>
        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{ color: 'var(--toast-icon)' }}
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 011.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="text-sm font-semibold leading-5" style={{ color: 'var(--toast-text)' }}>
          Enquiry Submitted Successfully
        </p>
        <p className="mt-0.5 text-xs leading-5" style={{ color: 'var(--toast-text-secondary)' }}>
          Our team will contact you soon.
        </p>
      </div>
    </div>
  </div>
)