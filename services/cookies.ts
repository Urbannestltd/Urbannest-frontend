export const storeUserToken = (token: string, persist: boolean) => {
  const maxAge = persist ? 60 * 60 * 24 * 30 : undefined
  document.cookie = `token=${token}; path=/; ${
    maxAge ? `max-age=${maxAge};` : ""
  } SameSite=Strict`
}

export const getUserToken = () => {
  const cookies = document.cookie.split(";")
  const tokenCookie = cookies.find((c) => c.trim().startsWith("token="))
  return tokenCookie ? tokenCookie.split("=")[1] : null
}

export const clearAuthTokens = () => {
  document.cookie = "token=; path=/; max-age=0"
}
