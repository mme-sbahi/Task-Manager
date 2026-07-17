import Cookies from "js-cookie"

const ACCESS_TOKEN_KEY = "taskflow_access_token"
const REFRESH_TOKEN_KEY = "taskflow_refresh_token"

export function setAuthTokens(accessToken: string, refreshToken: string) {
  // TODO: Set secure: true in production (requires HTTPS)
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1, sameSite: "lax", path: "/" })
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: "lax", path: "/" })
}

export function clearAuthTokens() {
  Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" })
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" })
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY)
}