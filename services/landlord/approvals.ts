import { landlordEndpoints } from "../endpoint"
import http from "../https"

export interface RejectTenantPayload {
	id: string
	reason?: string
}

export const approveTenant = async (id: string) => {
	const response = await http.patch(landlordEndpoints.approveTenant(id))
	return response.data
}

export const rejectTenant = async (payload: RejectTenantPayload) => {
	const response = await http.patch(landlordEndpoints.rejectTenant(payload.id), {
		reason: payload.reason,
	})
	return response.data
}
