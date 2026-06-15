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

export interface AddWalkInPayload {
	visitorName: string
	visitorPhone: string
	unitId: string
	fallbackRule: string
	visitorType: string
}

export interface Profile {
	inviteId: string
	visitorName: string
	visitorPhone: string
	visitorType: string
	frequency: string
	status: string
	scheduledFrom: string
	scheduledUntil: string
	hostTenant: {
		property: string
		unit: string
		name: string
		id: string
	}
	canCheckIn: boolean
	canCheckOut: boolean
	canRequestDeparture: boolean
	departureRequestPending: boolean
	checkedInAt: string
	checkedOutAt: string
}

export interface GetVisitorByCodeResponse {
	success: boolean
	data: {
		ok: boolean
		profile: Profile
		error: {
			message: string
			code: string
		}
	}
}

export interface statusResponse {
	id: string
	status: string
	approvalExpiresAt: string
	secondsUntilExpiry: number
	checkedInAt: string
	checkedOutAt: string
}

export interface GetStatusResponse {
	data: statusResponse
	success: boolean
}

export interface getRepeatWalkinVisitorResponse {
	visitorName: string
	visitorPhone: string
	visitorType: string
	lastVisitDate: string
	lastUnitId: string
	lastUnitName: string
	totalVisits: number
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

export const AddWalkIn = async (payload: AddWalkInPayload) => {
	const response = await http.post(FmEndpoints.fetchWalkinVisitors, payload)
	return response.data
}

export const GetVisitorByCode = async (code: string) => {
	const response = await http.get(FmEndpoints.getVisitorByCode(code))
	return response.data as Promise<GetVisitorByCodeResponse>
}

export const CheckInVisitor = async (id: string) => {
	const response = await http.post(FmEndpoints.checkinScheduledVisitor(id))
	return response.data
}

export const CheckOutVisitor = async (id: string, isWalkin: boolean) => {
	if (isWalkin) {
		const response = await http.post(FmEndpoints.checkoutWalkinVisitor(id))
		return response.data
	} else {
		const response = await http.post(FmEndpoints.checkoutScheduledVisitor(id))
		return response.data
	}
}

export const RepeatVisitor = async (search: string) => {
	const response = await http.get(FmEndpoints.getRepeatWalkinVisitor, {
		params: {
			search,
		},
	})
	return response.data as Promise<getRepeatWalkinVisitorResponse>
}

export const GetStatus = async (id: string) => {
	const response = await http.get(FmEndpoints.getWalkinVisitorStatus(id))
	return response.data as Promise<GetStatusResponse>
}
