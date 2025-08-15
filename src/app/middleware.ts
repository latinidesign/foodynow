import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')?.value
  const url = req.nextUrl.pathname

  if (!token && url.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (token) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role, plan')
        .eq('id', user.id)
        .single()

      if (!profile) return NextResponse.redirect(new URL('/auth/login', req.url))

      // Rol
      if (url.startsWith('/dashboard/merchant') && profile.role !== 'merchant') {
        return NextResponse.redirect(new URL('/dashboard/customer', req.url))
      }

      if (url.startsWith('/dashboard/customer') && profile.role !== 'customer') {
        return NextResponse.redirect(new URL('/dashboard/merchant', req.url))
      }

      // Plan
      if (url.startsWith('/premium') && profile.plan === 'free') {
        return NextResponse.redirect(new URL('/upgrade', req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/premium/:path*']
}
