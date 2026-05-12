export type PipelineStage = 'lead' | 'appointment' | 'qualified' | 'sold' | 'not_interested'

export interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  notes: string | null
  employee_count: string
  revenue_range: string
  calendly_event_id: string | null
  calendly_event_uri: string | null
  calendly_invitee_uri: string | null
  calendly_scheduled_at: string | null
  pipeline_stage: PipelineStage
  sold_amount: number | null
  created_at: string
  updated_at: string
}

export interface CreateLeadInput {
  first_name: string
  last_name: string
  email: string
  phone: string
  notes?: string
  employee_count: string
  revenue_range: string
}

export interface BlockedSlot {
  date: string
  times: string[]
}

export interface AvailabilityConfig {
  blockedSlots: BlockedSlot[]
  maxDaysAhead: number
  startHour: number
  endHour: number
}
