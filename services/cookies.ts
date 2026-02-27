import Cookies from "js-cookie"

const CookieApi = Cookies.withAttributes({
	path: "/",
	secure: false,
})

export const storeUserToken = (
	token: string,
	persistToken: boolean = false,
): void => {
	const options = persistToken ? { expires: 1 } : {}
	CookieApi.set("x-auth-token", token, options)
}
export const getRefreshToken = (): string | null => {
	const cookies = document.cookie.split(";")
	const refreshTokenCookie = cookies.find((c) =>
		c.trim().startsWith("refreshToken="),
	)
	return refreshTokenCookie ? refreshTokenCookie.split("=")[1] : null
}

export const storeRefreshToken = (
	token: string,
	persistToken: boolean = false,
): void => {
	const options = persistToken ? { expires: 7 } : {}
	CookieApi.set("x-refresh-token", token, options)
}

export const getUserToken = () => {
	const cookies = document.cookie.split(";")
	const tokenCookie = cookies.find((c) => c.trim().startsWith("token="))
	return tokenCookie ? tokenCookie.split("=")[1] : null
}

export const clearAuthTokens = (): void => {
	CookieApi.remove("x-auth-token")
	CookieApi.remove("x-refresh-token")
}
