import React, { useState } from 'react'

type Lead = any

const LeadDetail: React.FC<{ lead: Lead; onUpdate?: (updates: any) => void }> = ({ lead, onUpdate }) => {
  const [status, setStatus] = useState<string>(lead?.status ?? 'New')
  const [notes, setNotes] = useState<string>(lead?.notes ?? '')
  return (
    <div>
      <h3>Lead Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div><strong>Name:</strong> {lead?.first_name ?? ''} {lead?.last_name ?? ''}</div>
        <div><strong>Email:</strong> {lead?.email ?? ''}</div>
        <div><strong>Company:</strong> {lead?.company ?? ''}</div>
        <div><strong>Location:</strong> {lead?.city ?? ''} {lead?.state ?? ''}</div>
        <div><strong>Source:</strong> {lead?.data_source ?? ''}</div>
        <div><strong>Timestamp:</strong> {lead?.source_timestamp ?? lead?.created_at ?? ''}</div>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div style={{ marginTop: 12 }}>
        <label>Notes</label>
        <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '100%' }} />
      </div>
      <button
        style={{ marginTop: 8 }}
        onClick={() => onUpdate?.({ status, notes })}
      >
        Save Changes
      </button>
    </div>
  )
}

export default LeadDetail
