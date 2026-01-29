import endpoints from "@/services/endpoint"
import http from "@/services/https"
import { MaintenaceResponse } from "@/services/maintenance"
import { MessageCardProps } from "@/utils/model"
import { create } from "zustand"

interface MaintenanceStore {
	maintenance: MaintenaceResponse[]
	isLoading: boolean
	messages: MessageCardProps[]
	setMessages: (messages: MessageCardProps[]) => void
	addMessage: (message: MessageCardProps) => void
	fetchMaintenance: () => Promise<void>
	fetchMaintenanceMessages: (ticketId: string) => Promise<void>
	clearMaintenance: () => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => {
	return {
		maintenance: [],
		isLoading: false,
		messages: [],
		setMessages: (messages) => set({ messages }),
		fetchMaintenance: async () => {
			set({ isLoading: true })
			try {
				const response = await http.get(endpoints.getMaintenanceRequests)
				set({ maintenance: response.data.data })
			} catch (e) {
				console.error("❌ Failed to fetch maintenance", e)
			} finally {
				set({ isLoading: false })
			}
		},
		fetchMaintenanceMessages: async (ticketId: string) => {
			set({ isLoading: true })
			try {
				const response = await http.get(
					endpoints.getAllMaintenanceRequestsMessages(ticketId),
				)
				set((state) => ({ messages: [...state.messages, response.data.data] }))
			} catch (e) {
				console.error("❌ Failed to fetch maintenance messages", e)
			} finally {
				set({ isLoading: false })
			}
		},
		addMessage: (message) =>
			set((state) => ({ messages: [...state.messages, message] })),
		clearMaintenance: () => {
			set({ maintenance: [] })
		},
	}
})
