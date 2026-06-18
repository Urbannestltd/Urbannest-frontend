import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Visitor {
	id: string
	visitType: string
	normalizedStatus: string
	rawStatus: string
	visitorName: string
	visitorPhone: string
	propertyId: string
	propertyName: string
	propertyAddress: string
	unitId: string
	unitName: string
	visitDate: string
	agentId: string
	agentName: string
	purpose: string
	proposedDate: string
	rejectionReason: string
	tenantId: string
	tenantName: string
	frequency: string
	canApprove: boolean
	canReject: boolean
	canReschedule: boolean
	createdAt: string
	checkedInAt: string
	checkedOutAt: string
}

export interface WalkIn {
	id: string
	visitorName: string
	visitorPhone: string
	visitorType: string
	status: string
	unitId: string
	unitName: string
	propertyId: string
	propertyName: string
	tenantName: string
	fallbackRule: string
	approvalExpiresAt: string
	secondsUntilExpiry: number
	frequency: string
	checkedInAt: string
	checkedOutAt: string
	createdAt: string
}

interface filter {
	search?: string
	propertyId?: string
	status?: string
	type?: string
	dateFrom?: string
	dateTo?: string
}

export interface Stats {
	today: {
		total: number
		scheduled: number
		walkIns: number
		noShows: number
	}
	last15Days: {
		total: number
		scheduled: number
		walkIns: number
		noShows: number
	}
	last30Days: {
		total: number
		scheduled: number
		walkIns: number
		noShows: number
	}
}

interface VisitorStore {
	stats: Stats | null
	visitors: Visitor[]
	walkins: WalkIn[]
	isLoading: boolean
	isLoadingWalkins: boolean
	fetchVisitors: (filter?: filter) => Promise<void>
	fetchWalkins: (filter?: filter) => Promise<void>
	fetchStats: () => Promise<void>
}

export const useVisitorStore = create<VisitorStore>((set) => ({
	stats: null,
	visitors: [],
	walkins: [],
	isLoading: false,
	isLoadingWalkins: false,
	fetchVisitors: async (filter) => {
		set({ isLoading: true })
		try {
			const visitors = await http.get(FmEndpoints.fetchVisitors, {
				params: filter,
			})
			set({ visitors: visitors.data.data })
			console.log("✅ Visitors set in store:", visitors.data.data)
		} catch (e) {
			set({ visitors: [] })
			console.error("❌ Failed to fetch visitors", e)
		} finally {
			set({ isLoading: false })
		}
	},
	fetchWalkins: async (filter) => {
		set({ isLoadingWalkins: true })
		try {
			const walkins = await http.get(FmEndpoints.fetchWalkinVisitors, {
				params: filter,
			})
			set({ walkins: walkins.data.data })
			console.log("✅ Walkins set in store:", walkins.data.data)
		} catch (e) {
			set({ walkins: [] })
			console.error("❌ Failed to fetch walkins", e)
		} finally {
			set({ isLoadingWalkins: false })
		}
	},
	fetchStats: async () => {
		try {
			const stats = await http.get(FmEndpoints.fetchStats)
			set({ stats: stats.data.data })
			console.log("✅ Stats set in store:", stats.data.data)
		} catch (e) {
			set({ stats: null })
			console.error("❌ Failed to fetch stats", e)
		}
	},
}))
