import type { NextApiRequest, NextApiResponse } from 'next'
import { signPhase7Token } from '../../lib/auth7'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple token generator for Phase 7 (tests and internal flows)
  const token = signPhase7Token({ role: 'admin7' })
  res.status(200).json({ token })
}
