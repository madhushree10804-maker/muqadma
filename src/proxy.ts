import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Protect all /registry and /admin routes
  if (request.nextUrl.pathname.startsWith('/registry')) {
    
    // Very basic authorization for Phase 22 Security Hardening.
    // In a real app, this would use NextAuth or Supabase Auth.
    // For this event, a simple Basic Auth is used to keep participants out.
    
    const basicAuth = request.headers.get('authorization');
    const url = request.nextUrl;
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Use environment variables for secure admin credentials (fallback to hardcoded only if env is missing)
      const expectedUser = process.env.ADMIN_USERNAME || 'admin';
      const expectedPwd = process.env.ADMIN_PASSWORD || 'muqadma2026secure';
      
      if (user === expectedUser && pwd === expectedPwd) {
        return NextResponse.next();
      }
    }

    url.pathname = '/api/auth';
    return new NextResponse('Auth Required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Court Registry"' }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/registry/:path*'],
};
