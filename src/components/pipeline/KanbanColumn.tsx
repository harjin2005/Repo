'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import LeadCard from './LeadCard'
import type { Lead } from '@/lib/types'

interface Stage { key: string; label: string; color: string }
interface Props { stage: Stage; leads: Lead[] }

export default function KanbanColumn({ stage, leads }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.key })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-3 min-h-[200px] transition-all duration-200
        ${isOver ? 'ring-2 ring-blue-500/40 bg-blue-500/5' : 'bg-white/[0.03] border border-white/[0.06]'}`}
    >
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold mb-3 border ${stage.color}`}>
        {stage.label}
        <span className="bg-white/15 rounded-full px-1.5 text-[10px] font-bold">{leads.length}</span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
          {leads.length === 0 && (
            <div className="h-16 border border-dashed border-white/[0.06] rounded-lg flex items-center justify-center">
              <span className="text-slate-700 text-xs">Drop here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
