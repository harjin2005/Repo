'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { CreateLeadInput } from '@/lib/types'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Required'),
  notes: z.string().optional(),
})
type FormData = z.infer<typeof schema>

const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-colors"
const labelCls = "block text-xs text-slate-400 mb-1.5 uppercase tracking-wide"

interface Props { onNext: (data: Pick<CreateLeadInput,'first_name'|'last_name'|'email'|'phone'|'notes'>) => void }

export default function ContactStep({ onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First Name</label>
          <input {...register('first_name')} className={inputCls} placeholder="John" />
          {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input {...register('last_name')} className={inputCls} placeholder="Doe" />
          {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name.message}</p>}
        </div>
      </div>
      <div>
        <label className={labelCls}>Email</label>
        <input {...register('email')} type="email" className={inputCls} placeholder="john@company.com" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Phone</label>
        <input {...register('phone')} type="tel" className={inputCls} placeholder="+1 (555) 000-0000" />
        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Notes (optional)</label>
        <textarea {...register('notes')} className={`${inputCls} h-20 resize-none`} placeholder="Anything we should know..." />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
        Continue →
      </button>
    </form>
  )
}
