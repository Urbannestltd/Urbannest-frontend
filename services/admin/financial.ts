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

export const exportExpenses = async () => {
	const res = await http.get(adminEndpoints.exportFinancials, {
		responseType: "blob",
	})
	if (res.status === 204) {
		alert("No data to export")
		return
	}
	const url = window.URL.createObjectURL(new Blob([res.data]))

	const a = document.createElement("a")
	a.href = url
	a.download = "transactions.csv"
	a.click()

	window.URL.revokeObjectURL(url)
}
