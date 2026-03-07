import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple placeholder export; in a full implementation, re-use existing /api/leads/export logic
  const filePath = path.join(process.cwd(), 'tmp', 'leads.csv')
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, 'id,created_at,first_name,last_name,email,company,city,state,country,data_source,source_id\n')
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    res.status(200).send(await fs.readFile(filePath))
  } catch (e) {
    res.status(500).json({ error: 'Export failed' })
  }
}
