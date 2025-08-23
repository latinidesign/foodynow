// middleware.ts
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

function getSub(host: string): string | null {
  const [hostname] = host.split(':'); // quita el puerto
  const mLocal = hostname.match(/^([^.]+)\.localhost$/);
  if (mLocal) return mLocal[1];
  const mProd = hostname.match(/^([^.]+)\.foodynow\.com\.ar$/);
  if (mProd) return mProd[1];
  const mPrev = hostname.match(/^([^.]+)\.[^.]+\.vercel\.app$/);
  if (mPrev) return mPrev[1];
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const sub = getSub(host);

  const skip = pathname.startsWith('/_next') || pathname.startsWith('/api') ||
               pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml';
  if (skip || !sub) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/s/${sub}${pathname}`;

  // 👉 importante: pasar el header al **request**
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set('x-tenant', sub);

  return NextResponse.rewrite(url, { request: { headers: reqHeaders }});
}

export const config = { matcher: '/:path*' };
