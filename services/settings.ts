import { NotificationFormData } from "@/schema"
import endpoints from "./endpoint"
import http from "./https"

export interface UserProfilePayload {
	userFullName: string
	userEmail: string
	userPhone: string
	userEmergencyContact: string
	userProfileUrl: string
}

export interface createTicketPayload {
	category: string
	subject: string
	message: string
	priority: string
	attachments?: string[]
}

export const UpdateUserProfile = async (payload: UserProfilePayload) => {
	const response = await http.patch(endpoints.updateSettings, payload)
	return response.data
}

export const createTicket = async (payload: createTicketPayload) => {
	const response = await http.post(endpoints.createTicket, payload)
	return response.data
}

export const getNotifPreferences = async () => {
	const response = await http.get(endpoints.getNotifPreference)
	return response.data.data as Promise<NotificationFormData>
}

export const updateNotifPreferences = async (payload: NotificationFormData) => {
	const response = await http.patch(endpoints.updateNotifPreference, payload)
	return response.data
}
