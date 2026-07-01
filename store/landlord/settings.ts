import { landlordEndpoints } from "@/services/endpoint"
import http from "@/services/https"
import { create } from "zustand"

export interface UserSettings {
	userProfileUrl: string
	userEmergencyContact: string
	userPhone: string
	userEmail: string
	userFullName: string
	userId?: string
}

interface SettingsStore {
	userSettings: UserSettings | null
	isLoading: boolean
	setUserSettings: (userSettings: UserSettings) => void
	fetchUserSettings: () => Promise<void>
	clearUserSettings: () => void
}

export const useLandlordSettingStore = create<SettingsStore>((set) => ({
	userSettings: null,
	isLoading: false,
	fetchUserSettings: async () => {
		set({ isLoading: true })
		try {
			const userSettings = await http.get(landlordEndpoints.getSettings)
			set({ userSettings: userSettings.data.data })
		} catch (e) {
			set({ userSettings: null })
			console.error("❌ Failed to fetch landlord settings", e)
		} finally {
			set({ isLoading: false })
		}
	},
	setUserSettings: (userSettings: UserSettings) => {
		set({ userSettings })
	},
	clearUserSettings: () => {
		set({ userSettings: null })
	},
}))
