import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Tickets {
	id: string
	subject: string
	priority: string
	category: string
	dateSubmitted: string
	status: string
	assignedTo: {
		name: string
		id: string
	}
	unit: {
		name: string
		id: string
	}
	property: {
		name: string
		id: string
	}
	responseTimeMinutes: number
	projectedFixDeadline: string
	isResponseLate: boolean
	isFixLate: boolean
}

interface Ticket {
	id: string
	subject: string
	dateSubmitted: string
	status: string
	category: string
	description: string
	images: string[]
	activity: [
		{
			isSystemMessage: boolean
			timestamp: string
			message: string
			senderName: string
			id: string
		},
	]
	responseMetrics: {
		timeToResolutionMinutes: number
		timeToFirstResponseMinutes: number
	}
	timeline: [
		{
			timestamp: string
			event: string
		},
	]
}

interface TicketsStore {
	tickets: Tickets[]
	ticketsPerProperty: Tickets[]
	ticket: Ticket | null
	isLoading: boolean
	newComments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	} | null
	fetchAllTickets: () => Promise<void>
	fetchTicketPerProperty: (id: string) => Promise<void>
	fetchTicket: (id: string) => Promise<void>
	setComments: (comments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	}) => void
	clearTickets: () => void
}

export const useTicketStore = create<TicketsStore>((set) => ({
	tickets: [],
	ticketsPerProperty: [],
	ticket: null,
	newComments: null,
	isLoading: false,
	fetchAllTickets: async () => {
		set({ isLoading: true })
		const response = await http.get(adminEndpoints.fetchAllTickets)
		console.log("tickets", response.data.data)
		set({ tickets: response.data.data, isLoading: false })
	},
	fetchTicketPerProperty: async (id: string) => {
		set({ isLoading: true })
		const response = await http.get(adminEndpoints.fetchTicketsPerProperty(id))
		set({ ticketsPerProperty: response.data.data, isLoading: false })
	},
	fetchTicket: async (ticketId: string) => {
		set({ isLoading: true })
		const response = await http.get(adminEndpoints.fetchTicket(ticketId))
		console.log("ticket", response.data.data)
		set({ ticket: response.data.data, isLoading: false, newComments: null })
	},
	setComments: (comment) => set({ newComments: comment }),
	clearTickets: () => set({ tickets: [] }),
}))
