import endpoints from "@/services/endpoint"
import http from "@/services/https"
import { LeaseDetails } from "@/utils/model"
import axios from "axios"
import { create } from "zustand"
import useAuthStore from "./auth"

interface LeaseStore {
	lease: LeaseDetails | null
	isLoading: boolean
	fetchLease: () => Promise<void>
	clearLease: () => void
}

export const useLeaseStore = create<LeaseStore>((set) => ({
	lease: null,
	isLoading: false,
	fetchLease: async () => {
		set({ isLoading: true })
		try {
			const lease = await http.get(endpoints.getCurrentLease)
			set({ lease: lease.data.data })
			console.log("✅ Lease set in store:", lease.data.data)
			console.log("user token", useAuthStore.getState().token)
		} catch (e) {
			set({ lease: null })
			console.error("❌ Failed to fetch lease", e)
		} finally {
			set({ isLoading: false })
		}
	},
	clearLease: () => {
		set({ lease: null })
	},
}))
