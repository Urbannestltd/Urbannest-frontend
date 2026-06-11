import { ExpenseLog } from "@/app/facility-manager/properties/[id]/ticket-activity/columns"
import { FmEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Tickets {
	approvalStatus: string
	isFixLate: boolean
	isResponseLate: boolean
	responseTimeMinutes: number
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
	activity: [
		{
			isSystemMessage: true
			timestamp: string
			message: string
			senderName: string
			id: string
		},
	]
	rebuttalNote: string
	approvalStatus: string
	quotedCost: number
	budget: number
	tenant: {
		phone: string
		name: string
		id: string
	}
	unitName: string
	unitId: string
	propertyName: string
	propertyId: string
	images: string[]
	dateSubmitted: string
	status: string
	priority: string
	category: string
	description: string
	subject: string
	id: string
}

interface metrics {
	weeklyResolutionRate: number
	highPriorityOpenCount: number
	avgResponseMinutes: number
}

interface filter {
	search?: string
	propertyId?: string
	propertyType?: string
	status?: string
	priority?: string
	category?: string
	dateFrom?: string
	dateTo?: string
}

export interface message {
	isSystemMessage: true
	readAt: string
	timestamp: string
	attachments: string[]
	message: string
	senderName: string
	senderId: string
	id: string
}

interface TicketsStore {
	metrics: metrics | null
	tickets: Tickets[]
	messages: message[]
	globalBudget: {
		rebuttalNote: string
		approvalStatus: string
		quotedCost: number
		assignedBudget: number
		remainingBudget: number
		totalExpenses: number
		expenses: []
	} | null
	expense: ExpenseLog[]
	ticketsPerProperty: Tickets[]
	ticket: Ticket | null
	isLoading: boolean
	isLoadingTicket: boolean
	isLoadingPropertyTickets: boolean
	isLoadingMessages: boolean
	isLoadingExpense: boolean
	errorLoadingPropertyTickets: boolean
	errorLoadingTickets: boolean
	errorLoadingTicket: boolean
	errorLoadingMessages: boolean
	errorLoadingExpense: boolean
	loadingBudget: boolean
	newComments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	}[]
	fetchAllTickets: (filter?: filter) => Promise<void>
	fetchTicketPerProperty: (id: string, filter?: filter) => Promise<void>
	fetchTicket: (id: string) => Promise<void>
	fetchMessages: (id: string) => Promise<void>
	fetchMetrics: () => Promise<void>
	setComments: (comments: {
		isSystemMessage: boolean
		timestamp: string
		message: string
		senderName: string
		id: string
	}) => void
	fetchBudget: (id: string) => Promise<void>
	fetchExpenses: (id: string) => Promise<void>
	clearTickets: () => void
}

export const useTicketStore = create<TicketsStore>((set) => ({
	metrics: null,
	messages: [],
	tickets: [],
	ticketsPerProperty: [],
	ticket: null,
	globalBudget: null,
	newComments: [],
	isLoading: false,
	isLoadingPropertyTickets: false,
	isLoadingTicket: false,
	isLoadingMessages: false,
	isLoadingExpense: false,
	errorLoadingPropertyTickets: false,
	errorLoadingTickets: false,
	errorLoadingTicket: false,
	errorLoadingMessages: false,
	errorLoadingExpense: false,
	loadingBudget: false,
	expense: [],
	fetchAllTickets: async (filter) => {
		try {
			set({ isLoading: true, errorLoadingTickets: false })
			const response = await http.get(FmEndpoints.fetchAllTickets, {
				params: filter,
			})
			console.log("tickets", response.data.data)
			set({
				tickets: response.data.data,
			})
		} catch (e) {
			set({ tickets: [], errorLoadingTickets: true })
			console.error("❌ Failed to fetch tickets", e)
		} finally {
			set({ isLoading: false })
		}
	},
	fetchTicketPerProperty: async (id, filter) => {
		try {
			set({
				isLoadingPropertyTickets: true,
				errorLoadingPropertyTickets: false,
				ticketsPerProperty: [],
			})
			const response = await http.get(FmEndpoints.fetchTicketsPerProperty(id), {
				params: filter,
			})
			console.log("tickets", response.data.data.tickets)
			set({
				ticketsPerProperty: response.data.data.tickets,
			})
		} catch (e) {
			set({ ticketsPerProperty: [], errorLoadingPropertyTickets: true })
			console.error("❌ Failed to fetch tickets", e)
		} finally {
			set({ isLoadingPropertyTickets: false })
		}
	},
	fetchTicket: async (ticketId: string) => {
		try {
			set({ isLoadingTicket: true, errorLoadingTicket: false, ticket: null })
			const response = await http.get(FmEndpoints.fetchTicket(ticketId))
			console.log("ticket", response.data.data)
			set({
				ticket: response.data.data /* newComments: null */,
			})
		} catch (e) {
			set({ ticket: null, errorLoadingTicket: true })
			console.error("❌ Failed to fetch ticket", e)
		} finally {
			set({ isLoadingTicket: false })
		}
	},
	fetchMessages: async (id: string) => {
		try {
			set({ isLoadingMessages: true, errorLoadingMessages: false, messages: [] })
			const response = await http.get(FmEndpoints.postComments(id))
			console.log("messages", response.data.data)
			set({
				messages: response.data.data,
			})
		} catch (e) {
			set({ messages: [], errorLoadingMessages: true })
			console.error("❌ Failed to fetch messages", e)
		} finally {
			set({ isLoadingMessages: false })
		}
	},
	fetchMetrics: async () => {
		set({ isLoading: true })
		const response = await http.get(FmEndpoints.fetchTicketMetrics)
		set({ metrics: response.data.data, isLoading: false })
	},
	fetchBudget: async (id) => {
		set({ loadingBudget: true, globalBudget: null })
		const property = await http.get(FmEndpoints.fetchBudget(id))
		set({ globalBudget: property.data.data, loadingBudget: false })
	},
	fetchExpenses: async (id) => {
		try {
			set({ isLoadingExpense: true, errorLoadingExpense: false, expense: [] })
			const response = await http.get(FmEndpoints.getExpenses(id))
			console.log("expenses", response.data.data)
			set({
				expense: response.data.data,
			})
		} catch (e) {
			set({ expense: [], errorLoadingExpense: true })
			console.error("❌ Failed to fetch expenses", e)
		} finally {
			set({ isLoadingExpense: false })
		}
	},
	setComments: (comment) =>
		set((state) => ({ newComments: [...state.newComments, comment] })),
	clearTickets: () => set({ tickets: [] }),
}))
