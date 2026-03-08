import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '../lib/auth'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  if (url.pathname.startsWith('/admin')) {
    // Check cookie first
    const cookies = req.headers.get('cookie') || ''
    let token = ''
    const m = cookies.match(/admin_token=([^;]+);?/) // cookie-based
    if (m?.[1]) token = m[1]
    // Also support Authorization header
    const auth = req.headers.get('authorization') || ''
    if (!token && auth.startsWith('Bearer ')) {
      token = auth.substring(7)
    }
    const payload = verifyAdminToken(token)
    if (!payload || payload?.role !== 'admin') {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
