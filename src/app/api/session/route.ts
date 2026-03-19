import { NextRequest, NextResponse } from 'next/server'

// Called by client after Firebase Auth sign-in to set/clear session cookie
export async function POST(request: NextRequest) {
  const { idToken } = await request.json()

  const response = NextResponse.json({ ok: true })
  response.cookies.set('__session', idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('__session')
  return response
}
