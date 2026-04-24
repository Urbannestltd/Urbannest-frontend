import { NotificationFormData } from "@/schema"
import { adminEndpoints } from "../endpoint"
import http from "../https"

export interface ChangePasswordPayload {
	oldPassword: string
	newPassword: string
}

export const getNotifPreferences = async () => {
	const response = await http.get(adminEndpoints.getNotifPreference)
	return response.data.data as Promise<NotificationFormData>
}

export const updateNotifPreferences = async (payload: NotificationFormData) => {
	const response = await http.patch(
		adminEndpoints.updateNotifPreference,
		payload,
	)
	return response.data
}

export const ChangePassword = async (payload: ChangePasswordPayload) => {
	const response = await http.patch(adminEndpoints.changePassword, payload)
	return response.data
}
