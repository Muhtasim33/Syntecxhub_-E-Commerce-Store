import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Check for session token / auth indicator cookie
  // (In full JWT flow, a refresh_token or session cookie is present)
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Protected Account Routes
  if (pathname.startsWith('/account')) {
    // If client is accessing without session cookie, allow Next client guards or redirect
    // We let the client store check or handle route protection smoothly
  }

  // Protected Admin Routes
  if (pathname.startsWith('/admin')) {
    // Admin route protection
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/login', '/register'],
};
