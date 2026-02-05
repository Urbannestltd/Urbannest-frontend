import _ from "lodash"
import { User } from "@/utils/model"
import http from "./https"
import useAuthStore from "@/store/auth"
import Swal from "sweetalert2"
import endpoints from "./endpoint"
import { getRefreshToken } from "./cookies"

interface LoginPayload {
	email: string
	password?: string
	rememberMe?: boolean
}

interface LoginResponse {
	token: string
	user: User
}

interface SignUpPayload {
	userPassword: string
	userFullName: string
	userPhone: string
	userRoleName: "tenant" | "admin"
	rememberMe?: boolean
}

interface RegisterResponse {
	success: boolean
	message: string
	data: string
}

export interface ResetPasswordPayload {
	token: string
	newPassword: string
}

const REMEMBER_ME_KEY = "remember_user"

export const saveCredentials = (email: string, password: string) => {
	localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify({ email, password }))
}

export const getStoredCredentials = () => {
	const stored = localStorage.getItem(REMEMBER_ME_KEY)
	return stored ? JSON.parse(stored) : null
}

export const clearStoredCredentials = () => {
	localStorage.removeItem(REMEMBER_ME_KEY)
}

export const refreshToken = () => {
	const refreshTokenValue = getRefreshToken()
	if (!refreshTokenValue)
		throw new Error("No refresh token available, please login again")
}

export const loginUserApi = (payload: LoginPayload) => {
	return http.post<LoginResponse>(
		"/auth/login",
		_.omit(payload, ["rememberMe"]),
	)
}

export const registerUser = (payload: SignUpPayload, token: string) => {
	return http.post<RegisterResponse>(
		"/auth/register",
		_.omit(payload, ["rememberMe"]),
		{
			params: {
				token,
			},
			headers: {
				"Content-Type": "application/json",
			},
		},
	)
}

export const handleLogout = (navigate: (path: string) => void) => {
	Swal.fire({
		icon: "question",
		text: "Are you sure you want to log out?",
		showCancelButton: true,
		showConfirmButton: true,
		confirmButtonText: "Yes, log out",
		cancelButtonText: "Stay logged in",
		customClass: {
			confirmButton: "gradient-button",
			cancelButton: "swal-cancel",
		},
	}).then((result) => {
		if (result.isConfirmed) {
			const { logoutUser } = useAuthStore.getState()
			logoutUser()
			navigate("/auth")
		}
	})
}

export const forgotPassword = async (email: string) => {
	const response = await http.post(endpoints.forgotPassword, { email })
	return response.data
}

export const resetPassword = async (payload: ResetPasswordPayload) => {
	const response = await http.post(endpoints.resetPassword, payload)
	return response.data
}
