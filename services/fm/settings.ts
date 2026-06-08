import { FmEndpoints } from "../endpoint"
import http from "../https"

export interface UserProfilePayload {
	userFullName: string
	userEmail: string
	userPhone: string
	userEmergencyContact: string
	userProfileUrl: string
}

export interface ChangePasswordPayload {
	oldPassword: string
	newPassword: string
}

export const ChangePassword = async (payload: ChangePasswordPayload) => {
	const response = await http.post(FmEndpoints.changePassword, payload)
	return response.data
}

export const UpdateUserProfile = async (payload: UserProfilePayload) => {
	const response = await http.patch(FmEndpoints.getSettings, payload)
	return response.data
}
