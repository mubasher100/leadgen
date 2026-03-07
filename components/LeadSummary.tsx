import React from 'react'

type Props = {
  total: number
  newLeads?: number
  contacted?: number
  closed?: number
}

const LeadSummary: React.FC<Props> = ({ total, newLeads = 0, contacted = 0, closed = 0 }) => {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <strong>Total</strong>
        <div>{total}</div>
      </div>
      <div style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <strong>New</strong>
        <div>{newLeads}</div>
      </div>
      <div style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <strong>Contacted</strong>
        <div>{contacted}</div>
      </div>
      <div style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6 }}>
        <strong>Closed</strong>
        <div>{closed}</div>
      </div>
    </div>
  )
}

export default LeadSummary
