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
		isInternalNote: boolean
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

export interface addExpensePayload {
	data: {
		date: string
		description: string
		category: string
		amount: number
	}
	id: string
}

export interface editExpensePayload {
	data: {
		date: string
		description: string
		category: string
		amount: number
	}
	id: string
	ticketId: string
}

export interface flagExpensePayload {
	id: string
	ticketId: string
	data: {
		reason: string
	}
}

export interface deleteExpensePayload {
	id: string
	ticketId: string
}

export interface acceptExpenseRebuttalPayload extends deleteExpensePayload {}

export interface cancelExpensePayload extends deleteExpensePayload {}

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

export const addExpense = async (payload: addExpensePayload) => {
	const response = await http.post(
		FmEndpoints.getExpenses(payload.id),
		payload.data,
	)
	return response.data.data
}

export const editExpense = async (payload: editExpensePayload) => {
	const response = await http.patch(
		FmEndpoints.editExpense(payload.id, payload.ticketId),
		payload.data,
	)
	return response.data.data
}

export const flagExpense = async (payload: flagExpensePayload) => {
	const response = await http.post(
		FmEndpoints.flagExpense(payload.id, payload.ticketId),
		payload.data,
	)
	return response.data.data
}

export const deleteExpense = async (payload: deleteExpensePayload) => {
	const response = await http.delete(
		FmEndpoints.editExpense(payload.id, payload.ticketId),
	)
	return response.data.data
}

export const acceptExpenseRebuttal = async (
	payload: acceptExpenseRebuttalPayload,
) => {
	const response = await http.post(
		FmEndpoints.acceptExpenseRebuttal(payload.id, payload.ticketId),
	)
	return response.data.data
}

export const cancelExpense = async (payload: cancelExpensePayload) => {
	const response = await http.post(
		FmEndpoints.cancelExpense(payload.id, payload.ticketId),
	)
	return response.data.data
}
