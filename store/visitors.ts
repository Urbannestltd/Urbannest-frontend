import endpoints from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Visitor {
	status: "UPCOMING" | "CHECKED_IN" | "CHECKED_OUT"
	checkOutTime: string
	checkInTime: string
	expectedTime?: string
	frequency: string | undefined
	date: string
	code: string
	type: "GUEST" | "DELIVERY" | "SERVICE_PROVIDER" | string
	isGroupInvite: boolean
	groupName?: string
	visitorPhone: string
	visitorName: string
	id: string
}

interface Dashboard {
	totalVisitors: number
	totalScheduled: number
	totalWalkIns: number
}

interface VisitorStore {
	visitors: Visitor[]
	visitorDashboard: Dashboard | null
	isLoading: boolean
	setVisitors: (visitors: Visitor[]) => void
	addVisitor: (visitor: Visitor) => void
	fetchVisitors: () => Promise<void>
	fetchVisitorsDashboard: (value: string) => Promise<void>
	clearVisitors: () => void
}

export const useVistorsStore = create<VisitorStore>((set) => ({
	visitors: [],
	isLoading: false,
	visitorDashboard: null,
	fetchVisitors: async () => {
		set({ isLoading: true })
		try {
			const visitors = await http.get(endpoints.getVisitors)
			set({ visitors: visitors.data.data })
			console.log("✅ Visitors set in store:", visitors.data.data)
		} catch (e) {
			set({ visitors: [] })
			console.error("❌ Failed to fetch visitors", e)
		} finally {
			set({ isLoading: false })
		}
	},
	fetchVisitorsDashboard: async (value) => {
		set({ isLoading: true })
		try {
			const visitors = await http.get(endpoints.getVisitorsDashboard, {
				params: { period: value },
			})
			set({ visitorDashboard: visitors.data.data })
			console.log("✅ Visitors set in store:", visitors.data.data)
		} catch (e) {
			set({ visitorDashboard: null })
			console.error("❌ Failed to fetch visitors", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setVisitors: (visitors: Visitor[]) => {
		set({ visitors })
	},
	addVisitor: (visitor: Visitor) => {
		set((state) => ({ visitors: [visitor, ...state.visitors] }))
	},
	clearVisitors: () => {
		set({ visitors: [] })
	},
}))
