import { MessageCardProps } from "@/utils/model"
import endpoints from "./endpoint"
import http from "./https"

export interface MaintenaceResponse {
	messages: [
		{
			readAt: string
			ticketId: string
			senderId: string
			attachments: [string]
			message: string
			createdAt: string
			id: string
		},
	]
	unit: {
		name: string
	}
	assignedToId: string
	attachments: [string]
	priority: string
	category: string
	unitId: string
	tenantId: string
	description: string
	updatedAt: string
	createdAt: string
	status: string
	id: string
}

export interface getMaintenancePayload {
	category: string
	description: string
	priority: string
	attachments?: string[]
}

export interface messageProps {
	message: string
	attachments?: string[]
}

export interface submitMessagePayload {
	payload: messageProps
	ticketId: string
}

export interface getMaintenanceResponse {
	success: boolean
	message: string
	data: MaintenaceResponse[]
}

export const SubmitMaintanceRequest = async (
	payload: getMaintenancePayload,
) => {
	const response = await http.post(endpoints.createMaintenanceRequest, payload)
	return response.data as Promise<MaintenaceResponse>
}

export const sendMaintenanceMessage = async (payload: submitMessagePayload) => {
	const response = await http.post(
		endpoints.sendMaintenanceMessage(payload.ticketId),
		payload.payload,
	)
	return response.data.data as Promise<MessageCardProps>
}

export const getAllMaintenanceRequestsMessages = async (ticketId: string) => {
	const response = await http.get(
		endpoints.getAllMaintenanceRequestsMessages(ticketId),
	)
	return response.data as Promise<MessageCardProps[]>
}
