'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Lead } from '@/lib/types'

interface Props { lead: Lead; isDragging?: boolean }

export default function LeadCard({ lead, isDragging = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: lead.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`bg-white/[0.05] border border-white/[0.07] rounded-xl p-3 cursor-grab active:cursor-grabbing select-none transition-all duration-150
        ${isSortDragging || isDragging ? 'opacity-40 scale-95' : 'hover:bg-white/[0.08] hover:border-white/[0.12]'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="font-semibold text-sm text-white leading-tight">
          {lead.first_name} {lead.last_name}
        </p>
      </div>
      <p className="text-xs text-slate-500 truncate">{lead.email}</p>
      <p className="text-xs text-slate-600 truncate">{lead.phone}</p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="text-[10px] bg-white/[0.07] text-slate-400 px-2 py-0.5 rounded-md">{lead.employee_count}</span>
        <span className="text-[10px] bg-white/[0.07] text-slate-400 px-2 py-0.5 rounded-md">{lead.revenue_range}</span>
      </div>
      {lead.pipeline_stage === 'sold' && lead.sold_amount != null && (
        <p className="text-xs text-emerald-400 font-semibold mt-2">
          ${lead.sold_amount.toLocaleString()}
        </p>
      )}
      {lead.calendly_scheduled_at && (
        <p className="text-[10px] text-blue-400/70 mt-1.5">
          📅 {new Date(lead.calendly_scheduled_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
      {lead.notes && (
        <p className="text-[10px] text-slate-600 mt-1.5 italic line-clamp-2">{lead.notes}</p>
      )}
    </div>
  )
}
