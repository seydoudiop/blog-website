import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is not signed in and the current path is /admin, redirect the user to /admin/login
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // If user is signed in and the current path is /admin/login, redirect the user to /admin
  if (session && req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/admin',
    '/admin/login'
  ],
}
