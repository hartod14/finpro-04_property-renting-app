/** @format */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './helpers/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Redirect already logged in users away from auth pages
  if (
    (pathname.startsWith('/auth/user/login') ||
      pathname.startsWith('/auth/user/register') ||
      pathname.startsWith('/auth/tenant/login') ||
      pathname.startsWith('/auth/tenant/register')) &&
    session?.user?.id
  )
    return NextResponse.redirect(new URL('/', request.nextUrl)); // guest only

  // Redirect unauthenticated users to login
  if (
    (pathname.startsWith('/tenant') || pathname.startsWith('/user')) &&
    !session?.user?.id
  )
    return NextResponse.redirect(new URL('/', request.nextUrl));

  // Role-based access restrictions
  if (pathname.startsWith('/tenant') && session?.user?.role !== 'TENANT') {
    return NextResponse.redirect(new URL('/user', request.nextUrl));
  }

  if (pathname.startsWith('/user') && session?.user?.role !== 'USER') {
    return NextResponse.redirect(new URL('/tenant', request.nextUrl));
  }

  if (pathname.startsWith('/booking')) {
    if (session?.user?.role == 'TENANT') {
      return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (session?.user?.role == 'USER' && !session?.user?.is_verified) {
      return NextResponse.redirect(new URL('/user/account', request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|static|public|favicon.ico).*)',
};
