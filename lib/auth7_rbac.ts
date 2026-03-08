import { verifyPhase7Token } from './auth7'

// Verifies Phase 7 token and ensures the payload has an allowed role.
// Returns payload if allowed, or null if not authorized.
export function verifyPhase7TokenRBAC(token: string, allowedRoles: string[]) {
  const payload = verifyPhase7Token(token)
  if (!payload) return null
  const role = (payload as any).role
  if (!role) return null
  return allowedRoles.includes(role) ? payload : null
}

export default { verifyPhase7TokenRBAC }
