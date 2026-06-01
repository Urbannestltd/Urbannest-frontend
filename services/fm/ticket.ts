import { FmEndpoints } from "../endpoint"
import http from "../https"

export interface updateTicketStatusPayload {
	data: { status: string }
	id: string
}
export interface updateTicketPriorityPayload {
	data: { priority: string }
	id: string
}
export interface sendCommentPayload {
	data: {
		attachments?: string[]
		message: string
	}
	id: string
}
export interface filter {
	propertyId?: string
	propertyType?: string
	status?: string
	priority?: string
	category?: string
	dateFrom?: string
	dateTo?: string
}

export const updateTicketStatus = async (
	payload: updateTicketStatusPayload,
) => {
	const response = await http.patch(
		FmEndpoints.updateStatus(payload.id),
		payload.data,
	)
	return response.data
}

export const updateTicketPriority = async (
	payload: updateTicketPriorityPayload,
) => {
	const response = await http.patch(
		FmEndpoints.updatePriority(payload.id),
		payload.data,
	)
	return response.data
}

export const sendComment = async (payload: sendCommentPayload) => {
	const response = await http.post(
		FmEndpoints.postComments(payload.id),
		payload.data,
	)
	return response.data
}
