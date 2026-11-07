import GoogleLoginButton from '../GoogleLoginButton'

export default function PermissionDeniedScreen({ email }: { email: string }) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-red-900">Access Denied</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Your Google account is not authorized to access this page.</p>
        {email && (
          <p className="mt-5 text-sm text-slate-500">
            Signed in as: <span className="font-semibold text-slate-700">{email}</span>
          </p>
        )}
        <p className="mt-2 text-sm text-slate-500">Please contact the administrator if you believe you should have access.</p>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </section>
    </main>
  )
}
