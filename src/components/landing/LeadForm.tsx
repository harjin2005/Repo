'use client'
import { useState } from 'react'
import ContactStep from './ContactStep'
import EmployeeRangeSelector from './EmployeeRangeSelector'
import RevenueRangeSelector from './RevenueRangeSelector'
import CalendlyEmbed from './CalendlyEmbed'
import type { CreateLeadInput } from '@/lib/types'

type Step = 'contact' | 'employees' | 'revenue' | 'calendly'

const STEP_LABELS = ['Contact', 'Team Size', 'Revenue', 'Book Call']
const STEP_KEYS: Step[] = ['contact', 'employees', 'revenue', 'calendly']

export default function LeadForm() {
  const [step, setStep] = useState<Step>('contact')
  const [formData, setFormData] = useState<Partial<CreateLeadInput>>({})
  const [leadId, setLeadId] = useState<string | null>(null)
  const [booked, setBooked] = useState(false)

  const stepIdx = STEP_KEYS.indexOf(step)

  const handleContactDone = (data: Pick<CreateLeadInput, 'first_name'|'last_name'|'email'|'phone'|'notes'>) => {
    setFormData(p => ({ ...p, ...data }))
    setStep('employees')
  }

  const handleEmployeeDone = (employee_count: string) => {
    setFormData(p => ({ ...p, employee_count }))
    setStep('revenue')
  }

  const handleRevenueDone = async (revenue_range: string) => {
    const final = { ...formData, revenue_range } as CreateLeadInput
    setFormData(final)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(final),
      })
      const data = await res.json()
      if (data.id) setLeadId(data.id)
    } catch {}
    setStep('calendly')
  }

  return (
    <div className="glass rounded-2xl p-8 fade-up-1">
      {/* Step progress */}
      <div className="flex items-center mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                ${i < stepIdx ? 'bg-blue-500 text-white' :
                  i === stepIdx ? 'bg-blue-600 text-white ring-2 ring-blue-400/40 ring-offset-1 ring-offset-transparent' :
                  'bg-white/8 text-slate-500'}`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] whitespace-nowrap font-medium hidden sm:block
                ${i === stepIdx ? 'text-blue-400' : i < stepIdx ? 'text-slate-400' : 'text-slate-600'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px mx-3 transition-all duration-500 mb-4
                ${i < stepIdx ? 'bg-blue-500' : 'bg-white/8'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 'contact'   && <ContactStep onNext={handleContactDone} />}
      {step === 'employees' && <EmployeeRangeSelector onNext={handleEmployeeDone} />}
      {step === 'revenue'   && <RevenueRangeSelector onNext={handleRevenueDone} />}
      {step === 'calendly'  && !booked && (
        <CalendlyEmbed
          email={formData.email!}
          name={`${formData.first_name} ${formData.last_name}`}
          leadId={leadId}
          revenueRange={formData.revenue_range ?? ''}
          onBooked={() => setBooked(true)}
        />
      )}
      {step === 'calendly' && booked && (
        <div className="text-center py-10 fade-up">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-sora)' }}>
            You're all set!
          </h2>
          <p className="text-slate-400">We'll see you at your scheduled time.</p>
        </div>
      )}
    </div>
  )
}
