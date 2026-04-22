import { adminEndpoints } from "../endpoint"
import http from "../https"

export const suspendUser = async (id: string) => {
	const response = await http.put(adminEndpoints.suspendUser(id))
	return response.data
}
