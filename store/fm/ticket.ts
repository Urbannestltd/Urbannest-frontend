import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Tickets {
	approvalStatus: string
	isFixLate: boolean
	tenantName: string
	unitName: string
	unitId: string
	propertyName: string
	propertyId: string
	dateSubmitted: string
	status: string
	priority: string
	category: string
	subject: string
	id: string
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
	unit: {
		name: string
		id: string
	}
	property: {
		name: string
		id: string
	}
	tenant: {
		phone: string
		name: string
	}
	timeline: [
		{
			timestamp: string
			event: string
		},
	]
	budget: number
	quotedCost: number
	approvalStatus: string
	rebuttalNote: string
}

interface metrics {
	highPriorityOpenCount: number
	avgResponseTimeMinutes: number
	weeklyCompletionPercent: number
	weeklyTicketsTotal: number
	weeklyTicketsCompleted: number
	maintenanceCostEstimate: number
}

interface filter {
	propertyId?: string
	propertyType?: string
	status?: string
	priority?: string
	category?: string
	dateFrom?: string
	dateTo?: string
}

interface TicketsStore {
	//metrics: metrics | null
	tickets: Tickets[]
	/*globalBudget: {
		defaultMaintenanceBudget: number
	} | null */
	ticketsPerProperty: Tickets[]
	ticket: Ticket | null
	isLoading: boolean
	isLoadingTicket: boolean
	/*loadingBudget: boolean
	newComments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	} | null */
	fetchAllTickets: (filter?: filter) => Promise<void>
	fetchTicketPerProperty: (id: string, search?: string) => Promise<void>
	fetchTicket: (id: string) => Promise<void>
	/*fetchMetrics: () => Promise<void>
	setComments: (comments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	}) => void
	fetchBudget: () => Promise<void> */
	clearTickets: () => void
}

export const useTicketStore = create<TicketsStore>((set) => ({
	//metrics: null,
	tickets: [],
	ticketsPerProperty: [],
	ticket: null,
	//globalBudget: null,
	//newComments: null,
	isLoading: false,
	isLoadingTicket: false,
	//loadingBudget: false,
	fetchAllTickets: async (filter) => {
		set({ isLoading: true })
		const response = await http.get(FmEndpoints.fetchAllTickets, {
			params: filter,
		})
		console.log("tickets", response.data.data)
		set({ tickets: response.data.data, isLoading: false })
	},
	fetchTicketPerProperty: async (id, search) => {
		set({ isLoading: true })
		const response = await http.get(FmEndpoints.fetchTicketsPerProperty(id), {
			params: { search: search },
		})
		set({ ticketsPerProperty: response.data.data, isLoading: false })
	},
	fetchTicket: async (ticketId: string) => {
		set({ isLoading: true })
		const response = await http.get(FmEndpoints.fetchTicket(ticketId))
		console.log("ticket", response.data.data)
		set({
			ticket: response.data.data,
			isLoading: false /* newComments: null */,
		})
	},
	/*fetchMetrics: async () => {
		set({ isLoading: true })
		const response = await http.get(adminEndpoints.fetchTicketMetrics)
		set({ metrics: response.data.data, isLoading: false })
	},
	fetchBudget: async () => {
		set({ loadingBudget: true })
		const property = await http.get(adminEndpoints.createBudget)
		set({ globalBudget: property.data.data, loadingBudget: false })
	},
	setComments: (comment) => set({ newComments: comment }),*/
	clearTickets: () => set({ tickets: [] }),
}))
