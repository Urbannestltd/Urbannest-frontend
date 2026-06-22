import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

interface filter {
	propertyId?: string
	year?: string
	startDate?: string
	endDate?: string
}
export interface summary {
	totalRevenueCollected: number
	totalOutstandingRent: number
	activeLeasesCount: number
	totalUnitsCount: number
}

export interface revenueChart {
	propertyId: string
	propertyName: string
	expectedRevenue: number
	collectedRevenue: number
}

export interface UnitRevenueChart {
	unitId: string
	unitName: string
	expectedRent: number
	collectedRent: number
}

export interface revenueShare {
	propertyId: string
	propertyName: string
	revenueAmount: number
	revenuePercentage: number
}

export interface arrears {
	leaseId: string
	tenantName: string
	propertyName: string
	unitName: string
	balanceDue: number
	daysOverdue: number
}

export interface transactions {
	transactionId: string
	transactionDate: string
	tenantName: string
	propertyName: string
	unitName: string
	amount: number
	paymentType: string
	paymentStatus: string
	reference: string
}

interface FinancialStore {
	summary: summary | null
	revenueChart: revenueChart[] | UnitRevenueChart[]
	revenueShare: revenueShare[]
	arrears: arrears[]
	transactions: transactions[]
	loadingSummary: boolean
	loadingRevenueChart: boolean
	loadingRevenueShare: boolean
	loadingArrears: boolean
	loadingTransactions: boolean
	exportingTransactions: boolean
	fetchSummary: (filter?: filter) => Promise<void>
	fetchRevenueChart: (filter?: filter) => Promise<void>
	fetchRevenueShare: (filter?: filter) => Promise<void>
	fetchArrears: (filter?: filter) => Promise<void>
	fetchTransactions: (filter?: filter) => Promise<void>
	exportTransactions: (filter?: filter) => Promise<void>
}

export const useLandlordFinancialsStore = create<FinancialStore>((set) => ({
	summary: null,
	revenueChart: [],
	revenueShare: [],
	arrears: [],
	transactions: [],
	loadingSummary: false,
	loadingRevenueChart: false,
	loadingRevenueShare: false,
	loadingArrears: false,
	loadingTransactions: false,
	exportingTransactions: false,
	fetchSummary: async (filter) => {
		set({ loadingSummary: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchFinancialsMetrics,
				{
					params: filter,
				},
			)
			set({ summary: response.data.data })
		} catch (error) {
			set({ summary: null })
			console.error("❌ Failed to fetch landlord financial summary", error)
		} finally {
			set({ loadingSummary: false })
		}
	},
	fetchRevenueChart: async (filter) => {
		set({ loadingRevenueChart: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchFinancialsRevenueChart,
				{
					params: filter,
				},
			)
			set({ revenueChart: response.data.data ?? [] })
		} catch (error) {
			set({ revenueChart: [] })
			console.error("❌ Failed to fetch landlord revenue chart", error)
		} finally {
			set({ loadingRevenueChart: false })
		}
	},
	fetchRevenueShare: async (filter) => {
		set({ loadingRevenueShare: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchFinancialsRevenueShare,
				{
					params: filter,
				},
			)
			set({ revenueShare: response.data.data ?? [] })
		} catch (error) {
			set({ revenueShare: [] })
			console.error("❌ Failed to fetch landlord revenue share", error)
		} finally {
			set({ loadingRevenueShare: false })
		}
	},
	fetchArrears: async (filter) => {
		set({ loadingArrears: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchFinancialsArrears,
				{
					params: filter,
				},
			)
			set({ arrears: response.data.data ?? [] })
		} catch (error) {
			set({ arrears: [] })
			console.error("❌ Failed to fetch landlord arrears", error)
		} finally {
			set({ loadingArrears: false })
		}
	},
	fetchTransactions: async (filter) => {
		set({ loadingTransactions: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchFinancialsTransactions,
				{
					params: filter,
				},
			)
			set({ transactions: response.data.data ?? [] })
		} catch (error) {
			set({ transactions: [] })
			console.error("❌ Failed to fetch landlord transactions", error)
		} finally {
			set({ loadingTransactions: false })
		}
	},
	exportTransactions: async (filter) => {
		set({ exportingTransactions: true })
		try {
			const response = await http.get(landlordEndpoints.exportTransactions, {
				params: filter,
				responseType: "blob",
			})
			if (response.status === 204) return

			const url = window.URL.createObjectURL(new Blob([response.data]))
			const anchor = document.createElement("a")
			anchor.href = url
			anchor.download = "landlord-transactions.csv"
			anchor.click()
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error("❌ Failed to export landlord transactions", error)
			throw error
		} finally {
			set({ exportingTransactions: false })
		}
	},
}))
