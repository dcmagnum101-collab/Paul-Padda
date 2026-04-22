import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatLA, formatCurrency, normalizePhone } from '@/lib/utils'
import { CaseStatusBadge, PipelineStageBadge } from '@/components/cases/status-badge'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Phone, Mail, MapPin, Briefcase, Building2, FileText } from 'lucide-react'
import Link from 'next/link'
import { ContactEditForm } from './contact-edit-form'

export const dynamic = 'force-dynamic'

async function getContact(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: {
      clientCases: {
        include: { assignedTo: { select: { name: true } } },
        orderBy: { dateOpened: 'desc' },
      },
      caseContacts: {
        include: {
          case: {
            select: {
              id: true,
              caseNumber: true,
              title: true,
              status: true,
              stage: true,
              estimatedValue: true,
            },
          },
        },
      },
    },
  })
}

const TYPE_LABELS: Record<string, string> = {
  CLIENT: 'Client',
  OPPOSING_COUNSEL: 'Opposing Counsel',
  EXPERT: 'Expert Witness',
  WITNESS: 'Witness',
  INSURANCE: 'Insurance',
  MEDICAL_PROVIDER: 'Medical Provider',
  ADJUSTER: 'Insurance Adjuster',
  OTHER: 'Other',
}

const TYPE_VARIANTS: Record<string, 'gold' | 'danger' | 'info' | 'warning' | 'success' | 'muted' | 'cyan'> = {
  CLIENT: 'gold',
  OPPOSING_COUNSEL: 'danger',
  EXPERT: 'info',
  WITNESS: 'muted',
  INSURANCE: 'warning',
  MEDICAL_PROVIDER: 'success',
  ADJUSTER: 'warning',
  OTHER: 'muted',
}

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id)
  if (!contact) notFound()

  const allCases = [
    ...contact.clientCases.map(c => ({ ...c, role: 'Client' })),
    ...contact.caseContacts.map(cc => ({ ...cc.case, role: cc.role, assignedTo: null })),
  ]

  return (
    <div className="p-4 space-y-4 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/contacts" className="text-slate-500 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[11px] text-slate-600">Contacts</span>
        <span className="text-[11px] text-slate-600">/</span>
        <span className="text-[11px] text-white">
          {contact.firstName} {contact.lastName}
        </span>
      </div>

      {/* Header */}
      <div className="bg-[#0D1421] border border-[#1a2332] rounded-lg p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={TYPE_VARIANTS[contact.type] ?? 'muted'}>
                {TYPE_LABELS[contact.type] ?? contact.type}
              </Badge>
            </div>
            <h1 className="text-lg font-semibold text-white">
              {contact.firstName} {contact.lastName}
            </h1>
            {contact.company && (
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                {contact.company}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-slate-400">
            {contact.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" />
                {normalizePhone(contact.phone)}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {contact.email}
              </a>
            )}
            {(contact.city || contact.state) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {[contact.address, contact.city, contact.state, contact.zip].filter(Boolean).join(', ')}
              </span>
            )}
            {contact.barNumber && (
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Bar #{contact.barNumber}
              </span>
            )}
          </div>
        </div>

        {contact.notes && (
          <div className="mt-3 pt-3 border-t border-[#1a2332]">
            <p className="text-xs text-slate-400">{contact.notes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cases */}
        <div className="bg-[#0D1421] border border-[#1a2332] rounded-lg p-4">
          <h2 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-[#C9A84C]" />
            Cases ({allCases.length})
          </h2>
          {allCases.length === 0 ? (
            <p className="text-[11px] text-slate-600">No cases associated.</p>
          ) : (
            <div className="space-y-2">
              {allCases.map((c, i) => (
                <div key={`${c.id}-${i}`} className="flex items-start justify-between gap-2 py-1.5 border-b border-[#111827] last:border-0">
                  <div className="min-w-0">
                    <Link
                      href={`/cases/${c.id}`}
                      className="text-[11px] font-data text-[#C9A84C] hover:underline"
                    >
                      {c.caseNumber}
                    </Link>
                    <p className="text-[11px] text-white truncate">{c.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-slate-600">{c.role}</span>
                      {c.estimatedValue && (
                        <span className="text-[10px] text-slate-600">· {formatCurrency(c.estimatedValue)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <CaseStatusBadge value={c.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <ContactEditForm contact={{
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          address: contact.address ?? '',
          city: contact.city ?? '',
          state: contact.state ?? '',
          zip: contact.zip ?? '',
          company: contact.company ?? '',
          notes: contact.notes ?? '',
        }} />
      </div>

      <p className="text-[10px] text-slate-700 font-data">
        Added {formatLA(contact.createdAt, 'MMM d, yyyy')} · Last updated {formatLA(contact.updatedAt, 'MMM d, yyyy')}
      </p>
    </div>
  )
}
