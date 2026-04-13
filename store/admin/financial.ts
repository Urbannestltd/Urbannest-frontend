import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface financials {
	id: string
	reference: string
	amount: number
	status: string
	type: string
	dueDate: string
	paidDate: string
	createdAt: string
	tenant: {
		email: string
		name: string
		id: string
	}
	property: {
		name: string
		id: string
	}
	unit: {
		name: string
		id: string
	}
}
interface FinancialStore {
	financials: financials[]
	loading: boolean
	fetchFinancials: () => void
}

export const useFinancialStore = create<FinancialStore>((set) => ({
	financials: [],
	loading: false,
	fetchFinancials: async () => {
		set({ loading: true })
		try {
			const financials = await http.get(adminEndpoints.fetchFinancials)
			set({ financials: financials.data.data })
			console.log("✅ Financials set in store:", financials.data.data)
		} catch (e) {
			set({ financials: [] })
			console.error("❌ Failed to fetch financials", e)
		} finally {
			set({ loading: false })
		}
	},
}))
