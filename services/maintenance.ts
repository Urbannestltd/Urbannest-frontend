import { MessageCardProps } from "@/utils/model"
import endpoints from "./endpoint"
import http from "./https"
import axios from "axios"
import { file } from "zod"
import { ca } from "zod/v4/locales"

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
	subject: string
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
	subject: string
	category: string
	description: string
	priority: string
	attachments?: string[]
	attachment?: fileStorePayload
}

export interface editMaintenancePayload {
	ticketId: string
	payload: {
		category: string
		subject: string
		description: string
		priority: string
		attachments?: string[]
		attachment?: fileStorePayload
	}
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

export interface fileStorePayload {
	folder: string
	filename: string
}

export interface fileStoreResponse {
	success: boolean
	message: string
	data: {
		fullUrl: string
		publicPath: string
		uploadUrl: string
	}
}

export const StoreFile = async (payload: fileStorePayload) => {
	try {
		const response = await http.post(endpoints.storeFile, payload)
		return response.data as Promise<fileStoreResponse>
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || "File upload failed")
		}
		throw error
	}
}

export const SubmitMaintanceRequest = async (
	payload: getMaintenancePayload,
) => {
	try {
		// only upload if attachments exist
		if (payload.attachment) {
			const fileUploaded = await StoreFile({
				folder: "maintenance",
				filename: payload.attachment?.filename ?? "",
			})

			if (!fileUploaded.success) {
				throw new Error("File upload failed")
			}

			// attach uploaded URL to payload instead of redirecting
			payload.attachments = [fileUploaded.data.fullUrl]
			window.location.href = fileUploaded.data.uploadUrl
		}

		const payloadWithAttachments: getMaintenancePayload = {
			subject: payload.subject,
			category: payload.category.toUpperCase(),
			description: payload.description,
			priority: payload.priority,
		}
		if (payload.attachments) {
			payloadWithAttachments.attachments = payload.attachments
		}

		const response = await http.post(
			endpoints.createMaintenanceRequest,
			payloadWithAttachments,
		)

		return response.data as MaintenaceResponse
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Maintenance request failed",
			)
		}
		throw error
	}
}

export const EditMaintenanceRequest = async (
	payload: editMaintenancePayload,
) => {
	try {
		// only upload if attachments exist
		if (payload.payload.attachment) {
			const fileUploaded = await StoreFile({
				folder: "maintenance",
				filename: payload.payload.attachment?.filename ?? "",
			})

			if (!fileUploaded.success) {
				throw new Error("File upload failed")
			}

			// attach uploaded URL to payload instead of redirecting
			payload.payload.attachments = [fileUploaded.data.fullUrl]
			window.location.href = fileUploaded.data.uploadUrl
		}

		const payloadWithAttachments: editMaintenancePayload["payload"] = {
			subject: payload.payload.subject,
			category: payload.payload.category.toUpperCase(),
			description: payload.payload.description,
			priority: payload.payload.priority,
		}
		if (payload.payload.attachments) {
			payloadWithAttachments.attachments = payload.payload.attachments
		}

		const response = await http.patch(
			endpoints.editMaintenanceRequest(payload.ticketId),
			payloadWithAttachments,
		)

		return response.data as MaintenaceResponse
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Maintenance request failed",
			)
		}
		throw error
	}
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
