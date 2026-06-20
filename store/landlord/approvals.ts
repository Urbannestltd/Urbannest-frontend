import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Approvals {
	leadId: string
	applicantName: string
	propertyId: string
	propertyName: string
	unitId: string
	unitName: string
	annualRent: 0
	agentId: string
	agentName: string
	dateForwarded: string
	outcome?: string
	decidedAt?: string
	rejectionReason?: string
}
interface filter {
	propertyId?: string
	search?: string
	agentId?: string
	dateFrom?: string
	dateTo?: string
}
interface ApprovalsStore {
	pendingApprovals: Approvals[]
	approvalHistory: Approvals[]
	isLoadingPendingApprovals: boolean
	isLoadingApprovalHistory: boolean
	errorLoadingPendingApprovals: boolean
	errorLoadingApprovalHistory: boolean
	fetchPendingApprovals: (filter?: filter) => Promise<void>
	fetchApprovalHistory: (filter?: filter) => Promise<void>
}

export const useApprovalsStore = create<ApprovalsStore>((set) => ({
	pendingApprovals: [],
	approvalHistory: [],
	isLoadingPendingApprovals: false,
	isLoadingApprovalHistory: false,
	errorLoadingPendingApprovals: false,
	errorLoadingApprovalHistory: false,
	fetchPendingApprovals: async (filter?: filter) => {
		set({ isLoadingPendingApprovals: true })
		try {
			const response = await http.get(landlordEndpoints.fetchApprovals, {
				params: filter,
			})
			set({
				pendingApprovals: response.data.data,
				isLoadingPendingApprovals: false,
			})
		} catch (e) {
			set({ pendingApprovals: [], errorLoadingPendingApprovals: true })
			console.error("❌ Failed to fetch approvals", e)
		} finally {
			set({ isLoadingPendingApprovals: false })
		}
	},
	fetchApprovalHistory: async (filter?: filter) => {
		set({ isLoadingApprovalHistory: true })
		try {
			const response = await http.get(landlordEndpoints.fetchApprovasHistory, {
				params: filter,
			})
			set({
				approvalHistory: response.data.data,
				isLoadingApprovalHistory: false,
			})
		} catch (e) {
			set({ approvalHistory: [], errorLoadingApprovalHistory: true })
			console.error("❌ Failed to fetch approval history", e)
		} finally {
			set({ isLoadingApprovalHistory: false })
		}
	},
}))
