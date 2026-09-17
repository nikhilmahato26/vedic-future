import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get('vf_session')?.value;
    
    // We cannot verify JWT on Edge natively without jose and DB check here easily, 
    // so we just check existence and defer real verification to Server Actions / Layouts.
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
