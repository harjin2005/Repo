import StatusUpdateForm from '@/components/update/StatusUpdateForm'

export default function UpdatePage() {
  return (
    <main className="min-h-screen mesh-bg dot-grid flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8 fade-up">
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Update Lead Status
          </h1>
          <p className="text-slate-500 text-sm">Search by phone number and update the pipeline stage.</p>
        </div>
        <StatusUpdateForm />
      </div>
    </main>
  )
}
