'use client'
import { useState, useEffect } from 'react'
import type { AvailabilityConfig } from '@/lib/types'

const STORAGE_KEY = 'pipeline_availability_config'
const DEFAULT: AvailabilityConfig = { blockedSlots: [], maxDaysAhead: 5, startHour: 8, endHour: 21 }

function getNextDays(n: number): Date[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1); return d
  })
}

function hourLabel(h: number) {
  return h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`
}

export default function AvailabilityManager() {
  const [config, setConfig] = useState<AvailabilityConfig>(DEFAULT)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setConfig(JSON.parse(stored))
    setMounted(true)
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const toggleSlot = (dateStr: string, hourStr: string) => {
    setConfig(prev => {
      const existing = prev.blockedSlots.find(s => s.date === dateStr)
      if (existing) {
        const newTimes = existing.times.includes(hourStr)
          ? existing.times.filter(t => t !== hourStr)
          : [...existing.times, hourStr]
        return {
          ...prev,
          blockedSlots: newTimes.length === 0
            ? prev.blockedSlots.filter(s => s.date !== dateStr)
            : prev.blockedSlots.map(s => s.date === dateStr ? { ...s, times: newTimes } : s),
        }
      }
      return { ...prev, blockedSlots: [...prev.blockedSlots, { date: dateStr, times: [hourStr] }] }
    })
  }

  const isBlocked = (dateStr: string, hourStr: string) =>
    config.blockedSlots.find(s => s.date === dateStr)?.times.includes(hourStr) ?? false

  const hours = Array.from(
    { length: config.endHour - config.startHour },
    (_, i) => config.startHour + i
  )
  const days = mounted ? getNextDays(config.maxDaysAhead) : []

  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-sora)' }}>
            Calendar Availability
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Click slots to block them from booking</p>
        </div>
        <button onClick={save}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200
            ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Settings row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Days Ahead', key: 'maxDaysAhead' as const, min: 1, max: 30 },
          { label: 'Start Hour', key: 'startHour' as const, min: 0, max: 23 },
          { label: 'End Hour', key: 'endHour' as const, min: 1, max: 24 },
        ].map(({ label, key, min, max }) => (
          <div key={key}>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">{label}</label>
            <input
              type="number" min={min} max={max} value={config[key]}
              onChange={e => setConfig(p => ({ ...p, [key]: +e.target.value }))}
              className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {mounted && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="text-left text-slate-600 pb-2 pr-3 font-normal w-16">Time</th>
                {days.map(d => (
                  <th key={d.toISOString()} className="text-center text-slate-400 pb-2 px-1 font-medium min-w-[72px]">
                    <div>{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div className="text-slate-600 font-normal">{d.toLocaleDateString('en', { month: 'short', day: 'numeric' })}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(h => (
                <tr key={h}>
                  <td className="text-slate-600 pr-3 py-0.5">{hourLabel(h)}</td>
                  {days.map(d => {
                    const dateStr = d.toISOString().split('T')[0]
                    const hourStr = `${String(h).padStart(2, '0')}:00`
                    const blocked = isBlocked(dateStr, hourStr)
                    return (
                      <td key={dateStr} className="px-0.5 py-0.5">
                        <button
                          onClick={() => toggleSlot(dateStr, hourStr)}
                          className={`w-full h-6 rounded text-[10px] font-medium transition-all duration-100
                            ${blocked
                              ? 'bg-red-500/40 border border-red-500/50 text-red-300'
                              : 'bg-white/[0.04] border border-white/[0.06] text-slate-700 hover:bg-white/[0.08] hover:text-slate-500'}`}
                        >
                          {blocked ? '✕' : ''}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
