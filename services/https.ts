import useAuthStore from "@/store/auth"
import axios from "axios"
import { refreshToken } from "./auth"
import {
	clearAuthTokens,
	getUserToken,
	storeRefreshToken,
	storeUserToken,
} from "./cookies"

import toast from "react-hot-toast"
import {
	isErrorSuppressed,
	NETWORK_SUPPRESS_MS,
	startNetworkSuppression,
} from "@/utils/toast-guard"

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10_000,
})

function showNetworkToastOnce() {
	if (!isErrorSuppressed()) {
		toast.error(
			"Error in network connection. Check your internet and try again.",
		)
		startNetworkSuppression(NETWORK_SUPPRESS_MS)
	}
}
let isRefreshing = false
let failedRequestsQueue: Array<() => void> = []

axiosInstance.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	console.log("token from store:", token) // add this

	if (token) {
		config.headers.Authorization = token.startsWith("Bearer ")
			? token
			: `Bearer ${token}`
	}

	return config
})
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config

		const isTimeout = error.code === "ECONNABORTED"
		const isNetwork = !error.response
		const isOffline =
			typeof navigator !== "undefined" &&
			navigator &&
			navigator.onLine === false

		if (
			(isTimeout || isNetwork || isOffline) &&
			!originalRequest?.url?.includes("/auth/refresh")
		) {
			showNetworkToastOnce()
			;(error as any).__networkToastShown = true
			return Promise.reject(error)
		}

		const statusCode = error.response?.status
		const message = error.response?.data?.message
		if (
			(statusCode === 401 ||
				message?.includes("Unauthorized") ||
				message?.includes("Invalid token")) &&
			!originalRequest._retry &&
			!originalRequest?.url?.includes("/auth/refresh")
		) {
			originalRequest._retry = true
			if (isRefreshing) {
				return new Promise((resolve) => {
					failedRequestsQueue.push(() => {
						originalRequest.headers["x-auth-token"] = getUserToken()
						resolve(axiosInstance(originalRequest))
					})
				})
			}

			isRefreshing = true

			try {
				const { data } = await refreshToken()

				storeUserToken(data.accessToken)
				if (data.accessToken) {
					storeRefreshToken(data.accessToken)
				}

				setAuthTokenHeader(data.accessToken)

				originalRequest.headers["x-auth-token"] = data.accessToken

				failedRequestsQueue.forEach((cb) => cb())
				failedRequestsQueue = []

				return axiosInstance(originalRequest)
			} catch (refreshError) {
				clearAuthTokens()
				window.location.href = "/auth"
				toast.error("Session expired. Please log in again.")
				console.log("Refresh token error:", refreshError)
				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	},
)

const http = {
	post: axiosInstance.post,
	get: axiosInstance.get,
	patch: axiosInstance.patch,
	put: axiosInstance.put,
	delete: axiosInstance.delete,
}

export const setAuthTokenHeader = (accessToken: string) => {
	axiosInstance.defaults.headers.common["x-auth-token"] = accessToken
}

export default http
