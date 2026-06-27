import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface LeaseHistory {
	agreementUrl: string
	endDate: string
	startDate: string
	reference: string
}

export interface VisitorHistory {
	frequency: string
	status: string
	phone: string
	name: string
}

export interface PaymentHistory {
	status: string
	date: string
	amount: number
	type: string
}

export interface Cohabitant {
	photoUrl: string
	email: string
	name: string
}

interface TenantState {
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
	leaseHistory: LeaseHistory[]
	visitorHistory: VisitorHistory[]
	paymentHistory: PaymentHistory[]
	cohabitants: Cohabitant[]
}

interface TenantStore {
	tenant: TenantState | null
	isLoading: boolean
	fetchTenant: (tenantId: string) => Promise<void>
}

export const useLandlordTenantStore = create<TenantStore>((set) => ({
	tenant: null,
	isLoading: false,
	fetchTenant: async (tenantId: string) => {
		set({ isLoading: true, tenant: null })
		try {
			const tenant = await http.get(landlordEndpoints.fetchTenant(tenantId))
			set({ tenant: tenant.data.data })
			console.log("✅ Landlord tenant set in store:", tenant.data.data)
		} catch (e) {
			set({ tenant: null })
			console.error("❌ Failed to fetch landlord tenant", e)
		} finally {
			set({ isLoading: false })
		}
	},
}))
