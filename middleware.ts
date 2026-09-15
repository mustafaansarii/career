import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const backendApi = process.env.NEXT_PUBLIC_API_URL;
    const loginUrl = process.env.NEXT_PUBLIC_LOGIN_URL;

    if (!backendApi || !loginUrl) {
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    try {
      const headers = new Headers();
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        headers.set('authorization', authHeader);
      }
      
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        headers.set('cookie', cookieHeader);
      }

      const meUrl = `${backendApi}/api/auth/me`;
      const res = await fetch(meUrl, { headers });
      
      if (!res.ok) {
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL(loginUrl, request.url));
      }

      const userData = await res.json();
      const roles: string[] = userData.roles || [];
      const isAdmin = roles.some(role => role.toUpperCase() === 'ADMIN');

      if (!isAdmin) {
        if (request.nextUrl.pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
