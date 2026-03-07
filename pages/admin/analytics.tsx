import React, { useEffect, useState } from 'react'

type Analytics = {
  total: number
  byStatus: Record<string, number>
  bySource: Record<string, number>
}

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<Analytics | null>(null)
  useEffect(() => {
    fetch('/api/analytics/leads')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
  }, [])
  if (!data) return <div style={{ padding: 20 }}>Loading analytics...</div>
  const bars = Object.keys(data.byStatus || {})
  return (
    <div style={{ padding: 20 }}>
      <h1>Analytics Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10 }}>
        <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
          <strong>Total Leads (30d)</strong>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{data.total}</div>
        </div>
        <div style={{ border: '1px solid #e5e7eb', padding: 12, borderRadius: 6 }}>
          <strong>Leads by Source</strong>
          {Object.entries(data.bySource).map(([src, count]) => (
            <div key={src} style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
              <span style={{ width: 120 }}>{src}</span>
              <div style={{ height: 10, width: Math.max(20, count * 10), background: '#4f46e5' }}></div>
              <span style={{ marginLeft: 8 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <strong>Breakdown by Status</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {bars.map((b) => (
            <span key={b} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6 }}>{b}: {data.byStatus[b]}</span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={async () => {
          // Trigger a generic enrichment action for a demo lead (requires server logic to pick a lead or id)
          try {
            await fetch('/api/phase2/enrich-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: 'sample-id' }) })
            alert('Phase 2 enrich triggered')
          } catch {
            alert('Enrich endpoint not wired in this environment')
          }
        }}>Trigger Phase 2 Enrichment (demo)</button>
      </div>
    </div>
  )
}

export default AnalyticsPage
