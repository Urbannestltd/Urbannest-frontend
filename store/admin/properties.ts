import { Row } from "@/app/admin/dashboard/[id]/unit-columns"
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

export interface Unit {
	grouped: {
		Unassigned: Row[]
	}
	totalUnits: number
}

interface PropertyStore {
	properties: Property[]
	isLoading: boolean
	units: Unit | null
	fetchProperties: () => Promise<void>
	setProperties: (properties: Property[]) => void
	fetchUnits: (id: string) => Promise<void>
	selectedProperty: Property | null
	setSelectedProperty: (property: Property) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
	properties: [],
	isLoading: false,
	units: null,
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
	selectedProperty: null,
	fetchUnits: async (id: string) => {
		set({ isLoading: true })
		try {
			const units = await http.get(adminEndpoints.fetchUnits(id))
			set({ units: units.data.data })
			console.log("✅ Units set in store:", units.data.data)
		} catch (e) {
			set({ units: null })
			console.error("❌ Failed to fetch units", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setSelectedProperty: (property) => set({ selectedProperty: property }),
	setProperties: (properties: Property[]) => {
		set({ properties })
	},
}))
