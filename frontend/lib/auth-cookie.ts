import Cookies from "js-cookie"

const TOKEN_KEY = "taskflow_token"

export function setAuthCookie(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "lax",
    path: "/",
    // TODO: Set secure: true in production (requires HTTPS)
  })
}

export function clearAuthCookie() {
  Cookies.remove(TOKEN_KEY, { path: "/" })
}

export function getAuthCookie(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}
