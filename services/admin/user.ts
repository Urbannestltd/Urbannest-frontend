import { adminEndpoints } from "../endpoint"
import http from "../https"

export interface updatePermissionsPayload {
	id: string
	permissions: string[]
}

export const suspendUser = async (id: string) => {
	const response = await http.put(adminEndpoints.suspendUser(id))
	return response.data
}

export const activateUser = async (id: string) => {
	const response = await http.put(adminEndpoints.activateUser(id))
	return response.data
}

export const updatePermissions = async (payload: updatePermissionsPayload) => {
	const response = await http.patch(
		adminEndpoints.updatePermissions(payload.id),
		{ permissions: payload.permissions },
	)
	return response.data
}

export const deleteUser = async (id: string) => {
	const response = await http.delete(adminEndpoints.deleteUser(id))
	return response.data
}
