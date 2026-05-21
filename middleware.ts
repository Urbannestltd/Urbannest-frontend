import { jwtDecode } from "jwt-decode"
import { NextRequest, NextResponse } from "next/server"

type TokenPayload = {
	role: "ADMIN" | "TENANT"
	exp: number
}

export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	const token = req.cookies.get("x-auth-token")?.value

	if (!token) {
		if (pathname.startsWith("/admin") || pathname.startsWith("/tenant")) {
			return NextResponse.redirect(new URL("/auth", req.url))
		}
		return NextResponse.next()
	}

	let role: "ADMIN" | "TENANT"
	try {
		const decoded = jwtDecode<TokenPayload>(token)

		if (decoded.exp && decoded.exp * 1000 < Date.now()) {
			const response = NextResponse.redirect(new URL("/auth", req.url))
			response.cookies.delete("x-auth-token")
			return response
		}

		role = decoded.role
	} catch {
		const response = NextResponse.redirect(new URL("/auth", req.url))
		response.cookies.delete("x-auth-token")
		return response
	}

	if (pathname.startsWith("/admin") && role !== "ADMIN") {
		return NextResponse.redirect(new URL("/auth", req.url))
	}

	if (pathname.startsWith("/tenant") && role !== "TENANT") {
		return NextResponse.redirect(new URL("/auth", req.url))
	}

	if (pathname.startsWith("/auth") || pathname === "/") {
		if (role === "TENANT")
			return NextResponse.redirect(new URL("/tenant/dashboard", req.url))
		if (role === "ADMIN")
			return NextResponse.redirect(new URL("/admin/dashboard", req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/", "/auth/:path*", "/admin/:path*", "/tenant/:path*"],
}
