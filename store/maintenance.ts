import endpoints from "@/services/endpoint"
import http from "@/services/https"
import { MaintenaceResponse } from "@/services/maintenance"
import { MessageCardProps } from "@/utils/model"
import { create } from "zustand"

interface MaintenanceStore {
	maintenance: MaintenaceResponse[]
	isLoading: boolean
	isLoadingMessages: boolean

	messagesByTicket: Record<string, MessageCardProps[]>

	setMessages: (ticketId: string, messages: MessageCardProps[]) => void
	addMessage: (ticketId: string, message: MessageCardProps) => void

	fetchMaintenance: () => Promise<void>
	fetchMaintenanceMessages: (ticketId: string) => Promise<void>
	clearMaintenance: () => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => {
	return {
		maintenance: [],
		isLoading: false,
		isLoadingMessages: false,
		messagesByTicket: {},
		setMessages: (ticketId, messages) =>
			set((state) => ({
				messagesByTicket: {
					...state.messagesByTicket,
					[ticketId]: messages,
				},
			})),

		fetchMaintenance: async () => {
			set({ isLoading: true })
			try {
				const response = await http.get(endpoints.getMaintenanceRequests)
				set({ maintenance: response.data.data })
				console.log("✅ Maintenance set in store:", response.data.data)
			} catch (e) {
				console.error("❌ Failed to fetch maintenance", e)
			} finally {
				set({ isLoading: false })
			}
		},
		fetchMaintenanceMessages: async (ticketId: string) => {
			set({ isLoadingMessages: true })
			try {
				const response = await http.get(
					endpoints.getAllMaintenanceRequestsMessages(ticketId),
				)
				set((state) => ({
					messagesByTicket: {
						...state.messagesByTicket,
						[ticketId]: response.data.data, // 🔑 overwrite per ticket
					},
				}))
			} catch (e) {
				console.error("❌ Failed to fetch maintenance messages", e)
			} finally {
				set({ isLoadingMessages: false })
			}
		},
		addMessage: (ticketId, message) =>
			set((state) => ({
				messagesByTicket: {
					...state.messagesByTicket,
					[ticketId]: [...(state.messagesByTicket[ticketId] || []), message],
				},
			})),

		clearMaintenance: () => {
			set({ maintenance: [] })
		},
	}
})
