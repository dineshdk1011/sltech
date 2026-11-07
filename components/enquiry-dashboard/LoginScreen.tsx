import GoogleLoginButton from '../GoogleLoginButton'

export default function LoginScreen() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-gradient-brand text-2xl font-bold">Enquiry dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sign in with your authorized Google account to continue.
        </p>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </section>
    </main>
  )
}
