import Cookies from "js-cookie"

const CookieApi = Cookies.withAttributes({
  path: "/",
  secure: false,
})

export const getUserToken = (): string | null => {
  return CookieApi.get("x-auth-token") || null
}

export const storeUserToken = (
  token: string,
  persistToken: boolean = false
): void => {
  const options = persistToken ? { expires: 1 } : {}
  CookieApi.set("x-auth-token", token, options)
}

export const getRefreshToken = (): string | null => {
  return CookieApi.get("x-refresh-token") || null
}

export const storeRefreshToken = (
  token: string,
  persistToken: boolean = false
): void => {
  const options = persistToken ? { expires: 7 } : {}
  CookieApi.set("x-refresh-token", token, options)
}

export const clearAuthTokens = (): void => {
  CookieApi.remove("x-auth-token")
  CookieApi.remove("x-refresh-token")
}
