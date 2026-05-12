import LeadForm from '@/components/landing/LeadForm'

export default function LandingPage() {
  return (
    <main className="min-h-screen mesh-bg dot-grid flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10 fade-up">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-5 tracking-wide uppercase">
            Free Consultation
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-sora)' }}
          >
            Let's grow your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              business together
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Tell us about your business and book a strategy call.
          </p>
        </div>
        <LeadForm />
      </div>
    </main>
  )
}
