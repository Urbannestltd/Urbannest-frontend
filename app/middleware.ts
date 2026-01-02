import { jwtDecode } from "jwt-decode"
import { NextRequest, NextResponse } from "next/server"

type TokenPayload = {
  role: "admin" | "tenant"
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value
  const { pathname } = req.nextUrl

  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }
    return NextResponse.next()
  }

  const { role } = jwtDecode<TokenPayload>(token)

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  if (pathname.startsWith("/tenant") && role !== "tenant") {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/tenant/:path*"],
}
