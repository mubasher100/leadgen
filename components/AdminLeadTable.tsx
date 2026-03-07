import React from 'react'

type LeadRow = {
  id: string
  name?: string
  email?: string
  company?: string
  city?: string
  state?: string
  data_source?: string
  source_timestamp?: string
  status?: string
}
const AdminLeadTable: React.FC<{ leads: LeadRow[]; onLeadClick?: (lead: LeadRow) => void }> = ({ leads, onLeadClick }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200" style={{ cursor: onLeadClick ? 'pointer' : 'default' }}>
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {leads.map((l) => (
          <tr key={l.id} onClick={() => onLeadClick?.(l)}>
            <td className="px-4 py-2">{l.name ?? (l['first_name'] ?? '') + ' ' + (l['last_name'] ?? '')}</td>
            <td className="px-4 py-2">{l.email ?? '—'}</td>
            <td className="px-4 py-2">{l.company ?? '—'}</td>
            <td className="px-4 py-2">{`${l.city ?? ''} ${l.state ?? ''}`.trim() || '—'}</td>
            <td className="px-4 py-2">{l.data_source ?? '—'}</td>
            <td className="px-4 py-2">{l.source_timestamp ?? '—'}</td>
            <td className="px-4 py-2">{l.status ?? 'New'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AdminLeadTable
