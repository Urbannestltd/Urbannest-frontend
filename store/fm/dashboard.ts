import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

interface Summary {
	todayVisitorCount: number
	pendingBudgetApprovals: number
	openTickets: number
	propertiesManaged: number
}

export interface DashboardVisitor {
	checkedInAt: string
	status: string
	isWalkIn: boolean
	type: string
	validUntil: string
	validFrom: string
	tenantName: string
	unitName: string
	propertyName: string
	propertyId: string
	visitorName: string
	id: string
}

export interface DashboardTickets {
	createdAt: string
	status: string
	priority: string
	tenantName: string
	unitName: string
	propertyName: string
	propertyId: string
	subject: string
	id: string
}

interface DashStore {
	summary: Summary | null
	visitors: DashboardVisitor[]
	tickets: DashboardTickets[]
	isLoadingSummary: boolean
	isLoadingVisitors: boolean
	isLoadingTickets: boolean
	fetchSummary: () => Promise<void>
	fetchVisitors: () => Promise<void>
	fetchTickets: () => Promise<void>
	errorLoadingSummary: boolean
	errorLoadingVisitors: boolean
	errorLoadingTickets: boolean
}

export const useFMDashboardStore = create<DashStore>((set) => ({
	summary: null,
	visitors: [],
	tickets: [],
	isLoadingSummary: false,
	isLoadingVisitors: false,
	isLoadingTickets: false,
	errorLoadingSummary: false,
	errorLoadingVisitors: false,
	errorLoadingTickets: false,
	fetchSummary: async () => {
		set({ isLoadingSummary: true, errorLoadingSummary: false })
		try {
			const summary = await http.get(FmEndpoints.fetchDashboardSummary)
			set({ summary: summary.data.data, isLoadingSummary: false })
			console.log("✅ Summary set in store:", summary.data.data)
		} catch (e) {
			set({ summary: null, errorLoadingSummary: true })
			console.error("❌ Failed to fetch summary", e)
		} finally {
			set({ isLoadingSummary: false })
		}
	},
	fetchVisitors: async () => {
		set({ isLoadingVisitors: true, errorLoadingVisitors: false })
		try {
			const visitors = await http.get(FmEndpoints.fetchDashboardVisitors)
			set({ visitors: visitors.data.data, isLoadingVisitors: false })
			console.log("✅ Visitors set in store:", visitors.data.data)
		} catch (e) {
			set({ visitors: [], errorLoadingVisitors: true })
			console.error("❌ Failed to fetch visitors", e)
		} finally {
			set({ isLoadingVisitors: false })
		}
	},
	fetchTickets: async () => {
		set({ isLoadingTickets: true, errorLoadingTickets: false })
		try {
			const tickets = await http.get(FmEndpoints.fetchDashboardTickets)
			set({ tickets: tickets.data.data, isLoadingTickets: false })
			console.log("✅ Tickets set in store:", tickets.data.data)
		} catch (e) {
			set({ tickets: [], errorLoadingTickets: true })
			console.error("❌ Failed to fetch tickets", e)
		} finally {
			set({ isLoadingTickets: false })
		}
	},
}))
