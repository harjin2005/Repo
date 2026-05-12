'use client'
import { useState } from 'react'
import { EMPLOYEE_RANGES } from '@/lib/constants'

interface Props { onNext: (value: string) => void }

export default function EmployeeRangeSelector({ onNext }: Props) {
  const [selected, setSelected] = useState('')

  return (
    <div className="space-y-6 fade-up">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-sora)' }}>
          How many employees?
        </h2>
        <p className="text-slate-500 text-sm">Select the range that best fits your team.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EMPLOYEE_RANGES.map(r => (
          <button key={r} onClick={() => setSelected(r)}
            className={`py-3.5 px-4 rounded-xl border font-semibold text-sm transition-all duration-150
              ${selected === r
                ? 'border-blue-500 bg-blue-500/15 text-white shadow-lg shadow-blue-500/10'
                : 'border-white/8 bg-white/3 text-slate-400 hover:border-white/20 hover:text-white'}`}>
            {r}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onNext(selected)} disabled={!selected}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        Continue →
      </button>
    </div>
  )
}
