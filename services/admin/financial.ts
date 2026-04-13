import { adminEndpoints } from "../endpoint"
import http from "../https"

export interface addExpensePayload {
	amount: number
	category: string
	description: string
	date: string
	propertyId: string
	unitId: string
}

export const addExpense = async (payload: addExpensePayload) => {
	const response = await http.post(adminEndpoints.createExpense, payload)
	return response.data.data
}
