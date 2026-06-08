import { FmEndpoints } from "../endpoint"
import http from "../https"

export interface RejectPayload {
	id: string
	reason: string
}

export interface ReschedulePayload {
	id: string
	proposedDate: string
}

export const ApproveAgent = async (id: string) => {
	const response = await http.patch(FmEndpoints.approveVisitor(id))
	return response.data
}

export const RejectAgent = async (payload: RejectPayload) => {
	const response = await http.patch(FmEndpoints.rejectVisitor(payload.id), {
		reason: payload.reason,
	})
	return response.data
}

export const RescheduleAgent = async (payload: ReschedulePayload) => {
	const response = await http.patch(FmEndpoints.rescheduleVisitor(payload.id), {
		proposedDate: payload.proposedDate,
	})
	return response.data
}
