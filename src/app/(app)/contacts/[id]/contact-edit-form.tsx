'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

interface ContactEditFormProps {
  contact: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    company: string
    notes: string
  }
}

export function ContactEditForm({ contact }: ContactEditFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(contact)

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email || null,
          phone: form.phone || null,
          address: form.address || null,
          city: form.city || null,
          state: form.state || null,
          zip: form.zip || null,
          company: form.company || null,
          notes: form.notes || null,
        }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast({ title: 'Contact updated' })
      router.refresh()
    } catch {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full bg-[#060E1B] border border-[#1a2332] rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-[#C9A84C]/50 transition-colors'
  const labelCls = 'block text-[10px] text-slate-500 uppercase tracking-wide mb-1'

  return (
    <div className="bg-[#0D1421] border border-[#1a2332] rounded-lg p-4">
      <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
        Edit Contact
      </h2>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>First Name</label>
            <input className={inputCls} value={form.firstName} onChange={e => set('firstName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input className={inputCls} value={form.lastName} onChange={e => set('lastName', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input type="tel" className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Company / Firm</label>
          <input className={inputCls} value={form.company} onChange={e => set('company', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Address</label>
          <input className={inputCls} value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className={labelCls}>City</label>
            <input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>State</label>
            <input className={inputCls} maxLength={2} value={form.state} onChange={e => set('state', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>ZIP</label>
            <input className={inputCls} maxLength={10} value={form.zip} onChange={e => set('zip', e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Notes</label>
          <textarea
            rows={3}
            className={inputCls + ' resize-none'}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-[#C9A84C] hover:bg-[#b8953e] disabled:opacity-50 text-[#0A1628] font-semibold text-xs px-3 py-1.5 rounded transition-colors"
        >
          <Save className="w-3 h-3" />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
