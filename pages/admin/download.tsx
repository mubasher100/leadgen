import React from 'react'

const AdminDownload: React.FC = () => {
  const onDownload = () => {
    // Trigger browser to download the CSV from the export API
    window.location.href = '/api/leads/export'
  }
  return (
    <div style={{ padding: 20 }}>
      <h1>Admin CSV Export</h1>
      <p>Export a CSV of leads. This will download a file named leads.csv when available.</p>
      <button onClick={onDownload} style={{ marginTop: 12, padding: '8px 12px' }}>
        Download Leads CSV
      </button>
    </div>
  )
}

export default AdminDownload
