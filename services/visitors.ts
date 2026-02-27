import endpoints from "./endpoint"
import http from "./https"

export interface InviteVisitorPayload {
	visitor: {
		phone: string
		name: string
	}
	type: string
	frequency: string
	startDate?: string
	endDate?: string
}

export interface InviteVisitorGroupPayload {
	visitors: {
		name: string
		phone: string
	}[]
	type: string
	unitId: string
	groupName: string
	frequency?: string
	startDate?: string
	endDate?: string
}

interface InviteVisitorResponse {
	shareMessage: string
	validUntil: string
	visitorName: string
	code: string
}

export const InviteVisitor = async (payload: InviteVisitorPayload) => {
	const response = await http.post(endpoints.inviteVisitor, payload)
	return response.data.data as Promise<InviteVisitorResponse>
}

export const InviteVisitorBulk = async (payload: InviteVisitorGroupPayload) => {
	const response = await http.post(endpoints.inviteGroupVisitor, payload)
	return response.data as Promise<InviteVisitorResponse>
}
