import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REFRESH_TOKEN_COOKIE = "taskflow_refresh_token"

const publicPaths = ["/login", "/register"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = Boolean(request.cookies.get(REFRESH_TOKEN_COOKIE)?.value)

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (isPublic && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (!isPublic && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}