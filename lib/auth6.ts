import jwt from 'jsonwebtoken'

const SECRET6 = process.env.ADMIN_PHASE6_JWT_SECRET || 'default_phase6_secret'
const EXPIRY6 = '8h'

export function signPhase6Token(payload: any) {
  const base = payload || {}
  const role = (base as any).role ?? 'admin6'
  const token = jwt.sign({ ...base, role }, SECRET6, { expiresIn: EXPIRY6 })
  return token
}

export function verifyPhase6Token(token: string) {
  try {
    return jwt.verify(token, SECRET6) as any
  } catch {
    return null
  }
}

export default { signPhase6Token, verifyPhase6Token }
