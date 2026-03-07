import jwt from 'jsonwebtoken'

const SECRET = process.env.ADMIN_JWT_SECRET || 'default_admin_secret' // replace in prod
const EXPIRY = '2h'

export function signAdminToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRY })
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any
  } catch {
    return null
  }
}
