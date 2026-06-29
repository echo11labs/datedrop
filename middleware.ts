import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/games") {
    return NextResponse.redirect(new URL("/games", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/games/:path*"],
};
