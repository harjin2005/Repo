'use client'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import { QUALIFIED_REVENUE_THRESHOLD } from '@/lib/constants'

interface Props {
  email: string
  name: string
  leadId: string | null
  revenueRange: string
  onBooked: () => void
}

export default function CalendlyEmbed({ email, name, leadId, revenueRange, onBooked }: Props) {
  useCalendlyEventListener({
    onEventScheduled: async () => {
      if (leadId) {
        const newStage = revenueRange === QUALIFIED_REVENUE_THRESHOLD ? 'qualified' : 'appointment'
        try {
          await fetch(`/api/leads/${leadId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pipeline_stage: newStage }),
          })
        } catch {}
      }
      onBooked()
    },
  })

  return (
    <div className="fade-up">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
          Book Your Strategy Call
        </h2>
        <p className="text-slate-500 text-sm">Pick a time that works for you.</p>
      </div>
      <div className="rounded-xl overflow-hidden bg-white">
        <InlineWidget
          url={process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com'}
          prefill={{ email, name }}
          styles={{ height: '660px', minWidth: '320px' }}
        />
      </div>
    </div>
  )
}
