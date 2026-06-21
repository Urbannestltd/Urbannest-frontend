import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

interface Maintenance {
	openTickets: number
	totalExpenses: number
	avgResolutionDays: number
	chart: {
		propertyId: string
		propertyName: string
		ticketCount: number
		totalCost: number
	}[]
}
interface filter {
	category?: string
	year?: string
}
interface MaintenanceStore {
	maintenance: Maintenance | null
	isLoading: boolean
	fetchMaintenance: (filter?: filter) => Promise<void>
	clearMaintenance: () => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
	maintenance: null,
	isLoading: false,
	fetchMaintenance: async (filter?: filter) => {
		set({ isLoading: true })
		try {
			const response = await http.get(
				landlordEndpoints.fetchMaintenanceOverview,
				{
					params: filter,
				},
			)
			set({ maintenance: response.data.data })
			console.log("✅ Maintenance set in store:", response.data.data)
		} catch (e) {
			console.error("❌ Failed to fetch maintenance", e)
		} finally {
			set({ isLoading: false })
		}
	},
	clearMaintenance: () => {},
}))
