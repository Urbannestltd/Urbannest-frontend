import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Properties {
	createdAt: string
	complaints: number
	occupancyStatus: string
	occupancyRate: number
	unitCount: number
	images: string[]
	type: string
	city: string
	state: string
	address: string
	name: string
	id: string
}

export interface Property {
	id: string
	name: string
	address: string
	state: string
	city: string
	zip: string
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
	agent: {
		photoUrl: string
		email: string
		name: string
	}
	rentalRevenue: {
		revenue: number
		month: string
	}[]
}

export interface Units {
	grouped: {
		units: {
			complaints: {
				openPercent: number
				openCount: number
				total: number
			}
			members: number
			leaseExpiry: string
			moveInDate: string
			tenantProfilePic: string
			tenantName: string
			tenantId: string
			leaseId: string
			rentAmount: number
			status: string
			floor: string
			name: string
			id: string
		}[]
		floor: string
	}[]
	totalUnits: number
}

interface PropertyStore {
	properties: Properties[]
	property: Property | null
	isLoading: boolean
	isLoadingProperty: boolean
	isLoadingUnits: boolean
	units: Units | null
	errorLoadingProperty: boolean
	errorLoadingProperties: boolean
	errorLoadingUnits: boolean
	fetchProperties: (filter?: {
		search?: string
		type?: string
		occupancy?: string
		unitRange?: string
	}) => Promise<void>
	fetchProperty: (id: string) => Promise<void>
	fetchUnits: (id: string, search?: string) => Promise<void>
	selectedProperty: Property | null
	setSelectedProperty: (property: Property) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
	properties: [],
	property: null,
	isLoading: false,
	isLoadingUnits: false,
	isLoadingProperty: false,
	errorLoadingProperty: false,
	errorLoadingProperties: false,
	errorLoadingUnits: false,
	units: null,
	fetchProperties: async (filter) => {
		set({ isLoading: true, errorLoadingProperties: false })
		try {
			const properties = await http.get(FmEndpoints.fetchProperties, {
				params: filter,
			})
			set({ properties: properties.data.data })
			console.log("✅ Properties set in store:", properties.data.data)
		} catch (e) {
			set({ properties: [], errorLoadingProperties: true })
			console.error("❌ Failed to fetch properties", e)
		} finally {
			set({ isLoading: false })
		}
	},
	selectedProperty: null,
	fetchProperty: async (id: string) => {
		set({ isLoading: true, errorLoadingProperty: false, property: null })
		try {
			const property = await http.get(FmEndpoints.fetchProperty(id))
			set({ property: property.data.data })
			console.log("✅ Property set in store:", property.data.data)
		} catch (e) {
			set({ property: null, errorLoadingProperty: true })
			console.error("❌ Failed to fetch property", e)
		} finally {
			set({ isLoading: false })
		}
	},
	fetchUnits: async (id, search) => {
		set({ isLoadingUnits: true, errorLoadingUnits: false, units: null })
		try {
			const units = await http.get(FmEndpoints.fetchUnits(id), {
				params: { search: search },
			})
			set({ units: units.data.data })
			console.log("✅ Units set in store:", units.data.data)
		} catch (e) {
			set({ units: null, errorLoadingUnits: true })
			console.error("❌ Failed to fetch units", e)
		} finally {
			set({ isLoadingUnits: false })
		}
	},
	setSelectedProperty: (property) => set({ selectedProperty: property }),
	setProperties: (properties: Properties[]) => {
		set({ properties })
	},
}))
