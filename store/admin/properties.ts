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
	propertyImages: string[]
	dateListed: string
	facilityManager: {
		id: string
		name: string
		photoUrl: string
	}
	landlord: {
		id: string
		name: string
		photoUrl: string
	}
	alerts: string[]
}

export interface Property {
	id: string
	name: string
	address: string
	state: string
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
	rentalRevenue: {
		revenue: number
		month: string
	}[]
}

export interface Unit {
	grouped: {
		units: Row[]
		floor: string
	}[]
	totalUnits: number
}

export interface UnitDetail {
	maintenanceRequests: {
		createdAt: string
		priority: string
		status: string
		subject: string
		id: string
	}[]
	complaints: {
		openPercent: number
		openCount: number
		total: number
	}
	leaseHistory: {
		agreementUrl: string
		endDate: string
		startDate: string
		rentAmount: number
		status: string
		leaseId: string
	}[]

	currentLease: {
		agreementUrl: string
		moveOutNotice: string
		leaseExpiryPercentage: string
		leaseLength: string
		endDate: string
		startDate: string
		serviceCharge: number
		rentAmount: number
		leaseId: string
	}
	currentTenant: {
		phone: string
		email: string
		profilePic: string
		fullName: string
		tenantId: string
	}
	property: {
		images: string[]
		amenities: string[]
		city: string
		state: string
		address: string
		name: string
		type: string
		id: string
	}
	updatedAt: string
	createdAt: string
	baseRent: number
	type: string
	bathrooms: number
	bedrooms: number
	status: string
	floor: string
	name: string
	id: string
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
	unit: UnitDetail | null
	lease: Lease | null
	fetchProperties: (search?: string) => Promise<void>
	fetchProperty: (id: string) => Promise<void>
	fetchLease: (id: string) => Promise<void>
	setProperties: (properties: Properties[]) => void
	fetchUnits: (id: string, search?: string) => Promise<void>
	fetchUnit: (id: string) => Promise<void>
	clearUnit: () => void
	selectedProperty: Property | null
	setSelectedProperty: (property: Property) => void
}

export const usePropertyStore = create<PropertyStore>((set) => ({
	properties: [],
	property: null,
	isLoading: false,
	units: null,
	unit: null,
	lease: null,
	fetchProperties: async (search) => {
		set({ isLoading: true })
		try {
			const properties = await http.get(adminEndpoints.fetchProperties, {
				params: { search: search },
			})
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
	fetchUnits: async (id, search) => {
		set({ isLoading: true })
		try {
			const units = await http.get(adminEndpoints.fetchUnits(id), {
				params: { search: search },
			})
			set({ units: units.data.data })
			console.log("✅ Units set in store:", units.data.data)
		} catch (e) {
			set({ units: null })
			console.error("❌ Failed to fetch units", e)
		} finally {
			set({ isLoading: false })
		}
	},
	fetchUnit: async (id: string) => {
		set({ isLoading: true })
		try {
			const unit = await http.get(adminEndpoints.editUnit(id))
			set({ unit: unit.data.data })
			console.log("✅ Unit set in store:", unit.data.data)
		} catch (e) {
			set({ unit: null })
			console.error("❌ Failed to fetch unit", e)
		} finally {
			set({ isLoading: false })
		}
	},
	clearUnit: () => set({ unit: null }),
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
