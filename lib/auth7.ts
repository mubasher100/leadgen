import jwt from 'jsonwebtoken'

const SECRET7 = process.env.ADMIN_PHASE7_JWT_SECRET || 'default_phase7_secret'
const EXPIRY7 = '8h'

export function signPhase7Token(payload: any) {
  const base = payload || {}
  const role = (base as any).role ?? 'admin7'
  const token = jwt.sign({ ...base, role }, SECRET7, { expiresIn: EXPIRY7 })
  return token
}

export function verifyPhase7Token(token: string) {
  try {
    return jwt.verify(token, SECRET7) as any
  } catch {
    return null
  }
}

export default { signPhase7Token, verifyPhase7Token }
