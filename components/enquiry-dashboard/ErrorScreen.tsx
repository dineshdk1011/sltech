export default function ErrorScreen({ message, onLogout }: { message: string; onLogout: () => Promise<void> }) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-2xl font-bold text-red-900">Dashboard unavailable</h1>
        <p className="mt-2 text-sm text-red-700">{message}</p>
        <button type="button" onClick={() => { void onLogout() }} className="mt-6 rounded-md bg-[#002B8B] px-4 py-2 text-sm font-semibold text-white">
          Sign out
        </button>
      </section>
    </main>
  )
}
