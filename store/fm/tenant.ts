import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface leaseHistory {
	agreementUrl: string
	endDate: string
	startDate: string
	reference: string
}
export interface visitorHistory {
	frequency: string
	status: string
	phone: string
	name: string
}
export interface paymentHistory {
	status: string
	date: string
	amount: number
	type: string
}
export interface cohabitants {
	photoUrl: string
	email: string
	name: string
}
interface FMTenantState {
	id: string
	fullName: string
	profilePic: string
	status: string
	email: string
	phone: string
	emergencyContact: string
	dateOfBirth: string
	occupation: string
	employer: string
	currentLease: {
		agreementUrl: string
		moveOutNotice: string
		endDate: string
		startDate: string
		leaseLength: string
		leaseExpiryPercentage: string
		serviceCharge: number
		rentAmount: number
		leaseId: string
	}
	leaseHistory: leaseHistory[]
	visitorHistory: visitorHistory[]
	paymentHistory: paymentHistory[]
	cohabitants: cohabitants[]
}

interface FMTenantStore {
	tenant: FMTenantState | null
	isLoading: boolean
	fetchTenant: (id: string, tenantId: string) => Promise<void>
}

export const useFMTenantStore = create<FMTenantStore>((set) => ({
	tenant: {} as FMTenantState,
	isLoading: false,
	fetchTenant: async (id: string, tenantId: string) => {
		try {
			set({ isLoading: true })
			const tenant = await http.get(FmEndpoints.fetchTenant(id, tenantId))
			set({ tenant: tenant.data.data })
			console.log("✅ Tenant set in store:", tenant.data.data)
		} catch (e) {
			set({ tenant: null })
			console.error("❌ Failed to fetch tenant", e)
		} finally {
			set({ isLoading: false })
		}
	},
}))
