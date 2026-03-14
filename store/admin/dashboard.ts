import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

interface AdminDashboard {
	totalProperties: 0
	totalTenants: 0
	defaultingTenants: 0
	revenue: {
		amountCollected: 0
		expectedIncome: 0
	}
	maintenanceChart: {
		month: string
		count: number
	}[]
}
export interface Tenant {
	id: string
	name: string
	photoUrl: string
	phone: string
	address: string
	leaseDuration: string
	status: string
}
interface DashStore {
	dashboard: AdminDashboard | null
	tenants: Tenant[]
	isLoadingDashboard: boolean
	isLoadingTenants: boolean
	fetchDashboard: () => Promise<void>
	fetchTenantStatus: () => Promise<void>
	setDashboard: (dashboard: AdminDashboard) => void
}

export const useAdminDashboardStore = create<DashStore>((set) => ({
	dashboard: null,
	tenants: [],
	isLoadingDashboard: false,
	isLoadingTenants: false,
	fetchDashboard: async () => {
		set({ isLoadingDashboard: true })
		try {
			const dashboard = await http.get(adminEndpoints.fetchDashboard)
			set({ dashboard: dashboard.data.data })
			console.log("✅ Admin Dashboard set in store:", dashboard.data.data)
		} catch (e) {
			set({ dashboard: null })
			console.error("❌ Failed to fetch dashboard", e)
		} finally {
			set({ isLoadingDashboard: false })
		}
	},
	fetchTenantStatus: async () => {
		set({ isLoadingTenants: true })
		try {
			const tenants = await http.get(adminEndpoints.fetchUSers)
			set({ tenants: tenants.data.data })
			console.log("✅ Admin Dashboard set in store:", tenants.data.data)
		} catch (e) {
			set({ tenants: [] })
			console.error("❌ Failed to fetch tenants", e)
		} finally {
			set({ isLoadingTenants: false })
		}
	},
	setDashboard: (dashboard) => {
		set({ dashboard })
	},
}))
