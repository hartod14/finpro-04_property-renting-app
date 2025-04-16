/** @format */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./helpers/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (
    (pathname.startsWith("/auth/user/login") || pathname.startsWith("/auth/user/register")) &&
    session?.user?.id
  )
    return NextResponse.redirect(new URL("/", request.nextUrl)); // guest only

  else if (
    (pathname.startsWith("/tenant") || pathname.startsWith("/meong")) &&
    !session?.user?.id
  )
    return NextResponse.redirect(new URL("/auth/user/login", request.nextUrl)); // user only

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next|static|public|favicon.ico).*)",
};
