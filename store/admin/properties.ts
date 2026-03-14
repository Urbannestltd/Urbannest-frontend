import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Property {
	stats: {
		totalTenants: number
		expectedMonthlyIncome: number
		totalComplaints: number
		occupancyRate: string
		occupiedUnits: number
		totalUnits: number
	}
	landlord: string
	type: "MULTI_UNIT" | "SINGLE_UNIT"
	address: string
	name: string
	id: string
}

interface PropertyStore {
	properties: Property[]
	isLoading: boolean
	fetchProperties: () => Promise<void>
	setProperties: (properties: Property[]) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
	properties: [],
	isLoading: false,
	fetchProperties: async () => {
		set({ isLoading: true })
		try {
			const properties = await http.get(adminEndpoints.fetchProperties)
			set({ properties: properties.data.data })
			console.log("✅ Properties set in store:", properties.data.data)
		} catch (e) {
			set({ properties: [] })
			console.error("❌ Failed to fetch properties", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setProperties: (properties: Property[]) => {
		set({ properties })
	},
}))
