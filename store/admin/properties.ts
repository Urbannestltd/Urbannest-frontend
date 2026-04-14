import { Row } from "@/app/admin/dashboard/[id]/unit-columns"
import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Properties {
	propertyId: string
	propertyName: string
	occupancyPercent: number
	tenantSummary: {
		defaulting: number
		active: number
	}
	arrears: number
	openMaintenance: number
	openMaintenancePercent: number
	facilityManager: {
		id: string
		name: string
		photoUrl: string
	}
	alerts: string[]
	additionalProp1: {}
}

export interface Property {
	id: string
	name: string
	address: string
	lastUpdated: string
	rentalPrice: number
	noOfFloors: number
	noOfUnits: number
	listedOn: string
	occupancyRate: string
	complaintsPercentage: string
	images: string[]
	amenities: string[]
	facilityManager: {
		photoUrl: string
		email: string
		name: string
	}
	landlord: {
		photoUrl: string
		email: string
		name: string
	}
	rentalRevenue: [
		{
			revenue: number
			month: string
		},
	]
}

export interface Unit {
	grouped: {}
	totalUnits: number
}

interface PropertyStore {
	properties: Properties[]
	property: Property | null
	isLoading: boolean
	units: Unit | null
	fetchProperties: () => Promise<void>
	fetchProperty: (id: string) => Promise<void>
	setProperties: (properties: Properties[]) => void
	fetchUnits: (id: string) => Promise<void>
	selectedProperty: Property | null
	setSelectedProperty: (property: Property) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
	properties: [],
	property: null,
	isLoading: false,
	units: null,
	fetchProperties: async () => {
		set({ isLoading: true })
		try {
			const properties = await http.get(adminEndpoints.fetchProperties)
			set({ properties: properties.data.data.properties })
			console.log("✅ Properties set in store:", properties.data.data)
		} catch (e) {
			set({ properties: [] })
			console.error("❌ Failed to fetch properties", e)
		} finally {
			set({ isLoading: false })
		}
	},
	selectedProperty: null,
	fetchProperty: async (id: string) => {
		set({ isLoading: true })
		try {
			const property = await http.get(adminEndpoints.fetchProperty(id))
			set({ property: property.data.data })
			console.log("✅ Property set in store:", property.data.data)
		} catch (e) {
			set({ property: null })
			console.error("❌ Failed to fetch property", e)
		} finally {
			set({ isLoading: false })
		}
	},
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
	setProperties: (properties: Properties[]) => {
		set({ properties })
	},
}))
