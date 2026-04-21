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
	grouped: {
		units: Row[]
		floor: string
	}[]
	totalUnits: number
}

export interface Lease {
	id: string
	status: string
	rentAmount: number
	serviceCharge: number
	startDate: string
	endDate: string
	moveOutNotice: string
	documentUrl: string
	tenant: {
		phone: string
		name: string
		id: string
	}
	unit: {
		name: string
		id: string
	}
	property: {
		name: string
		id: string
	}
}

interface PropertyStore {
	properties: Properties[]
	property: Property | null
	isLoading: boolean
	units: Unit | null
	lease: Lease | null
	fetchProperties: () => Promise<void>
	fetchProperty: (id: string) => Promise<void>
	fetchLease: (id: string) => Promise<void>
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
	lease: null,
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
	fetchLease: async (id: string) => {
		set({ isLoading: true })
		try {
			const lease = await http.get(adminEndpoints.fetchLease(id))
			set({ lease: lease.data.data })
			console.log("✅ Lease set in store:", lease.data.data)
		} catch (e) {
			set({ lease: null })
			console.error("❌ Failed to fetch lease", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setSelectedProperty: (property) => set({ selectedProperty: property }),
	setProperties: (properties: Properties[]) => {
		set({ properties })
	},
}))
