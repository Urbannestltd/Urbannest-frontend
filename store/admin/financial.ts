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
export interface filters {
	propertyId?: string
	tenantId?: string
	startDate?: string
	endDate?: string
	type?: string
}
interface FinancialStore {
	financials: financials[]
	dashboard: financialDashboard | null
	fetchFinancialDashboard: () => void
	loading: boolean
	fetchFinancials: (filters?: filters) => void
}
interface financialDashboard {
	totalExpectedRevenue: 0
	totalCollected: 0
	outstandingAmount: 0
	defaultingTenants: 0
	collectedBreakdown: {
		utilityBills: 0
		serviceCharge: 0
		rent: 0
	}
}

export const useFinancialStore = create<FinancialStore>((set) => ({
	dashboard: null,
	financials: [],
	loading: false,
	fetchFinancials: async (filters) => {
		set({ loading: true })
		try {
			const financials = await http.get(adminEndpoints.fetchFinancials, {
				params: filters,
			})
			set({ financials: financials.data.data })
			console.log("✅ Financials set in store:", financials.data.data)
		} catch (e) {
			set({ financials: [] })
			console.error("❌ Failed to fetch financials", e)
		} finally {
			set({ loading: false })
		}
	},
	fetchFinancialDashboard: async () => {
		set({ loading: true })
		try {
			const dashboard = await http.get(adminEndpoints.fetchFinancialDashboard)
			set({ dashboard: dashboard.data.data })
			console.log("✅ Dashboard set in store:", dashboard.data.data)
		} catch (e) {
			set({ dashboard: null })
			console.error("❌ Failed to fetch dashboard", e)
		} finally {
			set({ loading: false })
		}
	},
}))
