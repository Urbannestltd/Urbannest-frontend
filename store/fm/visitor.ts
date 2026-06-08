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
}

interface VisitorStore {
	visitors: Visitor[]
	isLoading: boolean
	fetchVisitors: () => Promise<void>
}

export const useVisitorStore = create<VisitorStore>((set) => ({
	visitors: [],
	isLoading: false,
	fetchVisitors: async () => {
		set({ isLoading: true })
		try {
			const visitors = await http.get(FmEndpoints.fetchVisitors)
			set({ visitors: visitors.data.data })
			console.log("✅ Visitors set in store:", visitors.data.data)
		} catch (e) {
			set({ visitors: [] })
			console.error("❌ Failed to fetch visitors", e)
		} finally {
			set({ isLoading: false })
		}
	},
}))
