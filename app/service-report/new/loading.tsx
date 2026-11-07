import Loader from '@/components/Loader'

export default function Loading() {
  return (
    <main className="flex min-h-[40vh] items-center justify-center px-4 py-12">
      <Loader label="Loading service report form..." />
    </main>
  )
}