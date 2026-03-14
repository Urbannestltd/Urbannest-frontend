import endpoints from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

interface History {
	paymentId: string
	amount: 0
	date: string
	status: string
	reference: string
	description: string
	additionalProp1: {}
}

interface PaymentHistoryStore {
	history: History[]
	isLoading: boolean
	fetchPaymentHistory: () => Promise<void>
	clearPaymentHistory: () => void
}

export const usePaymentHistoryStore = create<PaymentHistoryStore>((set) => ({
	history: [],
	isLoading: false,
	fetchPaymentHistory: async () => {
		set({ isLoading: true })
		try {
			const history = await http.get(endpoints.rentHistory)
			set({ history: history.data.data })
			console.log("✅ Payment history set in store:", history.data.data)
		} catch (e) {
			set({ history: [] })
			console.error("❌ Failed to fetch payment history", e)
		} finally {
			set({ isLoading: false })
		}
	},
	clearPaymentHistory: () => {
		set({ history: [] })
	},
}))
