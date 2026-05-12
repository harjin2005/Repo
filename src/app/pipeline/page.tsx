import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '@/components/pipeline/KanbanBoard'
import AvailabilityManager from '@/components/pipeline/AvailabilityManager'
import LogoutButton from '@/components/pipeline/LogoutButton'
import type { Lead } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PipelinePage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold">P</span>
          </div>
          <h1 className="text-base font-semibold" style={{ fontFamily: 'var(--font-sora)' }}>Pipeline</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-sm">{(leads ?? []).length} leads</span>
          <LogoutButton />
        </div>
      </header>
      <div className="p-6 space-y-8">
        <KanbanBoard leads={(leads ?? []) as Lead[]} />
        <AvailabilityManager />
      </div>
    </div>
  )
}
