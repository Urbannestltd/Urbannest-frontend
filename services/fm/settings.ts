import { NotificationFormData } from "@/schema/fm"
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
export interface updateNotifPreference {
	fmEmailAgentReschedule: boolean
	fmEmailNewAgentVisit: boolean
	fmEmailBudgetResponse: boolean
	fmEmailAdminNote: boolean
	fmEmailTenantMessage: boolean
	fmEmailNewTicket: boolean
}

export const ChangePassword = async (payload: ChangePasswordPayload) => {
	const response = await http.post(FmEndpoints.changePassword, payload)
	return response.data
}

export const UpdateUserProfile = async (payload: UserProfilePayload) => {
	const response = await http.patch(FmEndpoints.getSettings, payload)
	return response.data
}

export const getNotifPreferences = async () => {
	const response = await http.get(FmEndpoints.getNotifPreference)
	return response.data.data as Promise<NotificationFormData>
}

export const updateNotifPreferences = async (
	payload: updateNotifPreference,
) => {
	const response = await http.patch(FmEndpoints.getNotifPreference, payload)
	return response.data
}
