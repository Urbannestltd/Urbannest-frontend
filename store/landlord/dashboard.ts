import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { TenantApprovals } from "@/utils/model"
import { create } from "zustand"

export interface Stats {
	totalProperties: number
	occupancyRate: number
	revenueCollected: number
	pendingApprovalsCount: number
}

export interface RevenueChart {
	propertyId: string
	propertyName: string
	expectedRevenue: number
	collectedRevenue: number
}

interface DashboardStore {
	stats: Stats | null
	revenueChart: RevenueChart[]
	approvals: TenantApprovals[]
	isLoadingStats: boolean
	isLoadingRevenueChart: boolean
	isLoadingApprovals: boolean
	errorLoadingStats: boolean
	errorLoadingRevenueChart: boolean
	errorLoadingApprovals: boolean
	fetchStats: () => Promise<void>
	fetchRevenueChart: () => Promise<void>
	fetchApprovals: () => Promise<void>
}

export const useLandlordDashboardStore = create<DashboardStore>((set) => ({
	stats: null,
	revenueChart: [],
	approvals: [],
	isLoadingStats: false,
	isLoadingRevenueChart: false,
	isLoadingApprovals: false,
	errorLoadingStats: false,
	errorLoadingRevenueChart: false,
	errorLoadingApprovals: false,
	fetchStats: async () => {
		set({ isLoadingStats: true, errorLoadingStats: false })
		try {
			const stats = await http.get(landlordEndpoints.fetchStats)
			set({ stats: stats.data.data })
			console.log("✅ Landlord stats set in store:", stats.data.data)
		} catch (e) {
			set({ stats: null, errorLoadingStats: true })
			console.error("❌ Failed to fetch landlord stats", e)
		} finally {
			set({ isLoadingStats: false })
		}
	},
	fetchRevenueChart: async () => {
		set({ isLoadingRevenueChart: true, errorLoadingRevenueChart: false })
		try {
			const revenueChart = await http.get(landlordEndpoints.fetchRevenueChart)
			set({ revenueChart: revenueChart.data.data ?? [] })
			console.log("✅ Landlord revenue chart set in store:", revenueChart.data.data)
		} catch (e) {
			set({ revenueChart: [], errorLoadingRevenueChart: true })
			console.error("❌ Failed to fetch landlord revenue chart", e)
		} finally {
			set({ isLoadingRevenueChart: false })
		}
	},
	fetchApprovals: async () => {
		set({ isLoadingApprovals: true, errorLoadingApprovals: false })
		try {
			const approvals = await http.get(landlordEndpoints.fetchApprovals)
			set({ approvals: normalizeApprovals(approvals.data.data) })
			console.log("✅ Landlord approvals set in store:", approvals.data.data)
		} catch (e) {
			set({ approvals: [], errorLoadingApprovals: true })
			console.error("❌ Failed to fetch landlord approvals", e)
		} finally {
			set({ isLoadingApprovals: false })
		}
	},
}))

const normalizeApprovals = (data: unknown): TenantApprovals[] => {
	const approvals = Array.isArray(data) ? data : []

	return approvals.map((item) => {
		const approval = item as Record<string, unknown>
		const applicant = approval.applicant as Record<string, unknown> | undefined
		const tenant = approval.tenant as Record<string, unknown> | undefined
		const property = approval.property as Record<string, unknown> | undefined
		const unit = approval.unit as Record<string, unknown> | undefined

		return {
			id: String(approval.id ?? approval.approvalId ?? ""),
			applicantName: String(
				approval.applicantName ??
				approval.tenantName ??
				applicant?.name ??
				tenant?.name ??
				tenant?.fullName ??
				"N/A",
			),
			propertyName: String(
				approval.propertyName ??
				property?.name ??
				"N/A",
			),
			unitName: String(
				approval.unitName ??
				unit?.name ??
				"N/A",
			),
		}
	})
}
