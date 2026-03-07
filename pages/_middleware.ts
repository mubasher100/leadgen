import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  if (url.pathname.startsWith('/admin')) {
    const cookies = req.headers.get('cookie') || ''
    if (!cookies.includes('admin_session=1')) {
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
