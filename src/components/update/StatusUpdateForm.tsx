'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Lead } from '@/lib/types'

type Action = 'sold' | 'not_interested' | null

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"

export default function StatusUpdateForm() {
  const [phone, setPhone] = useState('')
  const [lead, setLead] = useState<Lead | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [action, setAction] = useState<Action>(null)
  const [soldAmount, setSoldAmount] = useState('')
  const [searching, setSearching] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [done, setDone] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setNotFound(false)
    setLead(null)
    setAction(null)
    setDone(false)

    const supabase = createClient()
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phone.trim())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) setNotFound(true)
    else setLead(data as Lead)
    setSearching(false)
  }

  const handleUpdate = async () => {
    if (!lead || !action) return
    setUpdating(true)

    const body: Record<string, unknown> = { pipeline_stage: action }
    if (action === 'sold' && soldAmount) {
      body.sold_amount = parseFloat(soldAmount)
    }

    await fetch(`/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setUpdating(false)
    setDone(true)
  }

  const reset = () => {
    setDone(false)
    setLead(null)
    setPhone('')
    setAction(null)
    setSoldAmount('')
    setNotFound(false)
  }

  if (done) {
    return (
      <div className="glass rounded-2xl p-8 text-center fade-up">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl
          ${action === 'sold' ? 'bg-emerald-500/20' : 'bg-slate-700/50'}`}>
          {action === 'sold' ? '💰' : '👋'}
        </div>
        <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
          {action === 'sold' ? 'Deal closed!' : 'Marked as Not Interested'}
        </h2>
        <p className="text-slate-400 text-sm mb-1">
          {lead?.first_name} {lead?.last_name} moved to{' '}
          <span className="text-white font-medium">{action === 'sold' ? 'Sold' : 'Not Interested'}</span>.
        </p>
        {action === 'sold' && soldAmount && (
          <p className="text-emerald-400 font-semibold text-lg mt-2">
            ${parseFloat(soldAmount).toLocaleString()}
          </p>
        )}
        <button onClick={reset}
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Update Another
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6 fade-up-1">
      {/* Phone search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone number…"
          className={inputCls + ' flex-1'}
          required
        />
        <button
          type="submit"
          disabled={searching}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold px-5 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
        >
          {searching ? '…' : 'Search'}
        </button>
      </form>

      {notFound && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
          No lead found with that phone number.
        </div>
      )}

      {lead && (
        <div className="space-y-5 fade-up">
          {/* Lead info card */}
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-4">
            <p className="font-semibold text-white text-base">{lead.first_name} {lead.last_name}</p>
            <p className="text-slate-500 text-sm mt-0.5">{lead.email}</p>
            <p className="text-slate-600 text-sm">{lead.phone}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[11px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-full">
                {lead.employee_count} employees
              </span>
              <span className="text-[11px] bg-violet-500/10 border border-violet-500/20 text-violet-400 px-2.5 py-1 rounded-full">
                {lead.revenue_range}
              </span>
              <span className="text-[11px] bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full capitalize">
                {lead.pipeline_stage.replace('_', ' ')}
              </span>
            </div>
            {lead.notes && (
              <p className="text-slate-600 text-xs mt-3 italic border-t border-white/5 pt-3">{lead.notes}</p>
            )}
          </div>

          {/* Action buttons */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Update status</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setAction('sold')}
                className={`py-3.5 rounded-xl border font-semibold text-sm transition-all
                  ${action === 'sold'
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                    : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                💰 Sold
              </button>
              <button onClick={() => setAction('not_interested')}
                className={`py-3.5 rounded-xl border font-semibold text-sm transition-all
                  ${action === 'not_interested'
                    ? 'border-red-500/60 bg-red-500/15 text-red-300'
                    : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                👋 Not Interested
              </button>
            </div>
          </div>

          {/* Sold amount */}
          {action === 'sold' && (
            <div className="fade-up">
              <label className="block text-xs text-slate-400 uppercase tracking-wide mb-1.5">
                Deal Amount (USD)
              </label>
              <input
                type="number"
                value={soldAmount}
                onChange={e => setSoldAmount(e.target.value)}
                placeholder="e.g. 5000"
                className={inputCls}
              />
            </div>
          )}

          {action && (
            <button
              onClick={handleUpdate}
              disabled={updating || (action === 'sold' && !soldAmount)}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {updating ? 'Updating…' : `Confirm — ${action === 'sold' ? 'Mark as Sold' : 'Mark Not Interested'}`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
