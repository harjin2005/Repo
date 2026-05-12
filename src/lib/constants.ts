export const EMPLOYEE_RANGES = [
  '1–3', '3–5', '5–10', '10–25', '25–50', '50–100', '100+',
] as const

export const REVENUE_RANGES = [
  '$0 – $200K', '$200K – $500K', '$500K – $1M', '$1M+',
] as const

export const PIPELINE_STAGES = [
  { key: 'lead' as const,           label: 'Lead',           color: 'bg-blue-500/20 border-blue-500/40 text-blue-300' },
  { key: 'appointment' as const,    label: 'Appointment',    color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
  { key: 'qualified' as const,      label: 'Qualified',      color: 'bg-violet-500/20 border-violet-500/40 text-violet-300' },
  { key: 'sold' as const,           label: 'Sold',           color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' },
  { key: 'not_interested' as const, label: 'Not Interested', color: 'bg-red-500/20 border-red-500/40 text-red-300' },
] as const

export const QUALIFIED_REVENUE_THRESHOLD = '$1M+'
