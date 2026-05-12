'use client'
import { useState } from 'react'
import { REVENUE_RANGES, QUALIFIED_REVENUE_THRESHOLD } from '@/lib/constants'

interface Props { onNext: (value: string) => void }

export default function RevenueRangeSelector({ onNext }: Props) {
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!selected) return
    setLoading(true)
    await onNext(selected)
    setLoading(false)
  }

  return (
    <div className="space-y-6 fade-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
          Annual Revenue
        </h2>
        <p className="text-slate-500 text-sm">Your company's approximate annual revenue.</p>
      </div>
      <div className="space-y-2.5">
        {REVENUE_RANGES.map(r => (
          <button key={r} onClick={() => setSelected(r)}
            className={`w-full py-4 px-5 rounded-xl border text-left font-semibold text-sm flex items-center justify-between transition-all duration-150
              ${selected === r
                ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20 hover:text-white'}`}>
            <span>{r}</span>
            {r === QUALIFIED_REVENUE_THRESHOLD && (
              <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full tracking-wide uppercase font-semibold">
                Priority
              </span>
            )}
          </button>
        ))}
      </div>
      <button onClick={handleNext} disabled={!selected || loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        {loading ? 'Saving…' : 'Continue →'}
      </button>
    </div>
  )
}
