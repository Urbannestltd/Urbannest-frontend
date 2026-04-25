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

export interface rejectCostPayload {
	reason: string
	id: string
}

export interface offerRebuttalPayload {
	data: {
		message: string
		suggestedAmount: number
	}
	id: string
}
export interface updateBudgetPayload {
	data: {
		budget: number
		quotedCost: number
	}
	id: string
}

export interface createBudgetPayload {
	defaultMaintenanceBudget: number
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

export const rejectCost = async (payload: rejectCostPayload) => {
	const response = await http.put(adminEndpoints.rejectCost(payload.id), {
		reason: payload.reason,
	})
	return response.data
}

export const approveCost = async (id: string) => {
	const response = await http.put(adminEndpoints.approveCost(id))
	return response.data
}

export const offerRebuttal = async (payload: offerRebuttalPayload) => {
	const response = await http.put(
		adminEndpoints.offerRebuttal(payload.id),
		payload.data,
	)
	return response.data
}

export const updateBudget = async (payload: updateBudgetPayload) => {
	const response = await http.patch(
		adminEndpoints.updateBudget(payload.id),
		payload.data,
	)
	return response.data
}

export const createBudget = async (payload: createBudgetPayload) => {
	const response = await http.patch(adminEndpoints.createBudget, payload)
	return response.data
}
