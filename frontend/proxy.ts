import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TOKEN_COOKIE = "taskflow_token"

const publicPaths = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(TOKEN_COOKIE)?.value

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico"

  // Allow static assets through
  if (isStatic) return NextResponse.next()

  // Authenticated user trying to access login/register → redirect to dashboard
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Unauthenticated user trying to access protected route → redirect to login
  if (!isPublic && !token) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
