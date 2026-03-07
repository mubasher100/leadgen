import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLeadTable from '../../components/AdminLeadTable'
import LeadDetail from '../../components/LeadDetail'

type LeadRow = any

type Lead = any

export async function getServerSideProps({ req }) {
  const cookies = req.headers.cookie ?? ''
  const isAdmin = /admin_session=1/.test(cookies)
  if (!isAdmin) {
    return {
      redirect: { destination: '/admin/login', permanent: false },
    }
  }
  return { props: {} }
}

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch('/api/leads?page=1')
        if (res.ok) {
          const data = await res.json()
          setLeads(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = leads.filter((l) => {
    const q = query.toLowerCase()
    const matchQ = !q || (l.first_name?.toLowerCase() + ' ' + l.last_name?.toLowerCase()).includes(q) || (l.company ?? '').toLowerCase().includes(q)
    const matchS = !status || (l.status ?? '').toLowerCase() === status.toLowerCase()
    const matchSrc = !source || (l.data_source ?? '').toLowerCase() === source.toLowerCase()
    return matchQ && matchS && matchSrc
  })

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
        <input placeholder="Search leads" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Closed">Closed</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All sources</option>
          <option value="Google Places">Google Places</option>
          <option value="Yelp">Yelp</option>
        </select>
        <Link href="/admin/export">
          <a>Export CSV</a>
        </Link>
      </div>
      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: '55%' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <input placeholder="Search leads" value={query} onChange={(e) => setQuery(e.target.value)} />
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
              </select>
              <select value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="">All sources</option>
                <option value="Google Places">Google Places</option>
                <option value="Yelp">Yelp</option>
              </select>
              <Link href="/admin/export"><a>Export CSV</a></Link>
            </div>
            <AdminLeadTable leads={filtered} onLeadClick={setSelectedLead} />
          </div>
          <div style={{ width: '45%', minHeight: 200, borderLeft: '1px solid #e5e7eb', paddingLeft: 16 }}>
            {selectedLead ? (
              <LeadDetail lead={selectedLead} onUpdate={(updates) => {
                // Call API to update
                fetch('/api/leads/update', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: selectedLead.id, ...updates }),
                })
                .then(() => {
                  // refresh list
                  setSelectedLead(null)
                  // reload leads
                  fetch('/api/leads?page=1').then(r => r.json()).then(setLeads)
                })
              }} />
            ) : (
              <p>Select a lead to view details</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
