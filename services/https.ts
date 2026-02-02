import useAuthStore from "@/store/auth"
import axios from "axios"

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10_000,
})

axiosInstance.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().token

		if (token) {
			config.headers.Authorization = token.startsWith("Bearer ")
				? token
				: `Bearer ${token}`
		}

		return config
	},
	(error) => {
		if (error.response?.status === 401) {
			console.log("🔒 Token expired or unauthorized")
			useAuthStore.getState().logoutUser()
			window.location.href = "/auth"
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

export default http
