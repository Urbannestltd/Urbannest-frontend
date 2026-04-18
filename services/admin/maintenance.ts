import { adminEndpoints } from "../endpoint"
import http from "../https"

export interface updateTicketStatusPayload {
	data: { status: string; adminId: string }
	id: string
}

export interface sendCommentPayload {
	data: {
		message: string
		senderId: string
	}
	id: string
}

export const updateTicketStatus = async (
	payload: updateTicketStatusPayload,
) => {
	const response = await http.put(
		adminEndpoints.updateStatus(payload.id),
		payload.data,
	)
	return response.data
}

export const sendComment = async (payload: sendCommentPayload) => {
	const response = await http.post(
		adminEndpoints.postComments(payload.id),
		payload.data,
	)
	return response.data
}
