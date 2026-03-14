import { create } from "zustand"
import { Visitor } from "./visitors"
import http from "@/services/https"
import endpoints from "@/services/endpoint"

interface dashboard {
	user: {
		firstName: string
		profilePicUrl: string
	}
	lease: {
		isActive: boolean
		amount: number
		currency: string
		expiryDate: string
		daysRemaining: number
		progressPercentage: number
		status: string
	}
	maintenance: {
		active: number
		completed: number
		total: number
	}
	visitorsToday: {
		walkInCount: number
		scheduledCount: number
		list: Visitor[]
	}
}

interface DashStore {
	dashboard: dashboard | null
	isLoading: boolean
	fetchDashboard: (days: number) => Promise<void>
	setDashboard: (dashboard: dashboard) => void
}

export const useDashboardStore = create<DashStore>((set) => ({
	dashboard: null,
	isLoading: false,
	fetchDashboard: async (days = 7) => {
		set({ isLoading: true })
		try {
			const params = { days: days }
			const dashboard = await http.get(endpoints.fetchDashboardData, { params })
			set({ dashboard: dashboard.data.data })
			console.log("✅ Dashboard set in store:", dashboard.data.data)
		} catch (e) {
			set({ dashboard: null })
			console.error("❌ Failed to fetch dashboard", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setDashboard: (dashboard) => {
		set({ dashboard })
	},
}))
