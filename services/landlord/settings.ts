import { landlordEndpoints } from "../endpoint"
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

export interface createTicketPayload {
	category: string
	subject: string
	message: string
	priority: string
	attachments?: string[]
}

export interface LandlordNotificationPreferences {
	emailPayments: boolean
	emailLease: boolean
	emailMaintenance: boolean
	emailTenantApprovals: boolean
}

export const UpdateUserProfile = async (payload: UserProfilePayload) => {
	const response = await http.patch(landlordEndpoints.updateSettings, payload)
	return response.data
}

export const createTicket = async (payload: createTicketPayload) => {
	const response = await http.post(landlordEndpoints.createTicket, payload)
	return response.data
}

export const ChangePassword = async (payload: ChangePasswordPayload) => {
	const response = await http.post(landlordEndpoints.changePassword, payload)
	return response.data
}

export const getNotifPreferences = async () => {
	const response = await http.get(landlordEndpoints.getNotifPreference)
	return response.data.data as LandlordNotificationPreferences
}

export const updateNotifPreferences = async (
	payload: LandlordNotificationPreferences,
) => {
	const response = await http.patch(
		landlordEndpoints.updateNotifPreference,
		payload,
	)
	return response.data
}

export const getTwoFactorStatus = async () => {
	const response = await http.get(landlordEndpoints.get2fa)
	return response.data.data as {
		isTwoFactorEnabled: boolean
	}
}

export const updateTwoFactorStatus = async (payload: { enabled: boolean }) => {
	const response = await http.patch(landlordEndpoints.get2fa, payload)
	return response.data
}
