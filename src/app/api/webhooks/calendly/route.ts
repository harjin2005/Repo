import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { QUALIFIED_REVENUE_THRESHOLD } from '@/lib/constants'

export async function POST(request: Request) {
  const body = await request.json()

  if (body.event !== 'invitee.created') {
    return NextResponse.json({ ok: true })
  }

  const invitee = body.payload?.invitee
  const event = body.payload?.event

  if (!invitee?.email) {
    return NextResponse.json({ error: 'no email' }, { status: 400 })
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: lead } = await supabase
    .from('leads')
    .select('id, revenue_range')
    .eq('email', invitee.email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!lead) {
    return NextResponse.json({ error: 'lead not found' }, { status: 404 })
  }

  const newStage =
    lead.revenue_range === QUALIFIED_REVENUE_THRESHOLD ? 'qualified' : 'appointment'

  await supabase
    .from('leads')
    .update({
      pipeline_stage: newStage,
      calendly_event_uri: event?.uri ?? null,
      calendly_invitee_uri: invitee?.uri ?? null,
      calendly_scheduled_at: event?.start_time ?? null,
    })
    .eq('id', lead.id)

  return NextResponse.json({ ok: true, stage: newStage })
}
