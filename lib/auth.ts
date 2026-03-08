import jwt from 'jsonwebtoken'

const SECRET = process.env.ADMIN_JWT_SECRET || 'default_admin_secret' // replace in prod
const EXPIRY = '2h'

export function signAdminToken(payload: any) {
  const base = payload || {}
  const role = (base as any).role ? (base as any).role : 'admin'
  const toSign = { ...base, role }
  return jwt.sign(toSign, SECRET, { expiresIn: EXPIRY })
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any
  } catch {
    return null
  }
}
