'use client'
import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import KanbanColumn from './KanbanColumn'
import LeadCard from './LeadCard'
import { PIPELINE_STAGES } from '@/lib/constants'
import type { Lead, PipelineStage } from '@/lib/types'

interface Props { leads: Lead[] }

export default function KanbanBoard({ leads: initialLeads }: Props) {
  const [leads, setLeads] = useState(initialLeads)
  const [activeId, setActiveId] = useState<string | null>(null)

  const activeLead = leads.find(l => l.id === activeId)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const leadId = active.id as string
    const targetStage = over.id as PipelineStage

    // Only update if dropped on a column (stage key)
    const isStage = PIPELINE_STAGES.some(s => s.key === targetStage)
    if (!isStage) return

    const lead = leads.find(l => l.id === leadId)
    if (!lead || lead.pipeline_stage === targetStage) return

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, pipeline_stage: targetStage } : l))

    await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pipeline_stage: targetStage }),
    })
  }

  return (
    <section>
      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Leads by Stage</h2>
      <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PIPELINE_STAGES.map(stage => (
            <KanbanColumn
              key={stage.key}
              stage={stage}
              leads={leads.filter(l => l.pipeline_stage === stage.key)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead && <LeadCard lead={activeLead} isDragging />}
        </DragOverlay>
      </DndContext>
    </section>
  )
}
