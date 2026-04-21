import { adminEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface User {
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

interface UserStore {
	users: User[] | null
	isLoading: boolean
	fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
	users: null,
	isLoading: false,
	fetchUsers: async () => {
		set({ isLoading: true })
		const users = await http.get(adminEndpoints.fetchUsers)
		set({ users: users.data.data, isLoading: false })
		console.log("✅ Users set in store:", users.data.data)
	},
}))
