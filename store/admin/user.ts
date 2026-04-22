import { Properties } from "@/app/admin/user-management/[id]/landlord-columns"
import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface Users {
	createdAt: string
	emergencyContact: string
	employer: string
	occupation: string
	dateOfBirth: string
	profileUrl: string
	status: string
	role: string
	phone: string
	email: string
	fullName: string
	id: string
}

export interface User {
	properties: {
		asAgent: Properties[]
		asFacilityManager: Properties[]
		asLandlord: Properties[]
	}
	createdAt: string
	emergencyContact: string
	employer: string
	occupation: string
	dateOfBirth: string
	profileUrl: string
	status: string
	role: string
	phone: string
	email: string
	fullName: string
	id: string
}

export interface Activity {
	createdAt: string
	ipAddress: string
	description: string
	action: string
	userId: string
	id: string
}

interface UserStore {
	users: Users[]
	user: User | null
	activities: Activity[]
	isLoading: boolean
	fetchUser: (id: string) => Promise<void>
	fetchUsers: () => Promise<void>
	fetchActivities: (id: string) => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
	users: [],
	user: null,
	activities: [],
	isLoading: false,
	fetchUsers: async () => {
		set({ isLoading: true })
		const users = await http.get(adminEndpoints.fetchUsers)
		set({ users: users.data.data, isLoading: false })
		console.log("✅ Users set in store:", users.data.data)
	},
	fetchUser: async (id) => {
		set({ isLoading: true })
		const user = await http.get(adminEndpoints.fetchUser(id))
		set({ user: user.data.data, isLoading: false })
		console.log("✅ User set in store:", user.data.data)
	},
	fetchActivities: async (id) => {
		set({ isLoading: true })
		const activities = await http.get(adminEndpoints.fetchActivities(id))
		set({ activities: activities.data.data, isLoading: false })
		console.log("✅ Activities set in store:", activities.data.data)
	},
}))
