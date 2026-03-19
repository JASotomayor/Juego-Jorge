import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = pathname === '/'
    || pathname === '/demo'
    || pathname.startsWith('/auth')
    || pathname.startsWith('/_next')
    || pathname.startsWith('/api')

  if (!isPublicRoute) {
    const session = request.cookies.get('__session')
    if (!session?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
}
