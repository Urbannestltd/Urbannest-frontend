import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { User } from "../utils/model"
import { clearAuthTokens, storeUserToken } from "@/services/cookies"

interface AuthStore {
	user: User | null
	token: string | null
	twofa: boolean | null
	isHydrated: boolean

	loginUser: (
		userData: User,
		token: string,
		twofa: boolean,
		persistToken: boolean,
	) => void
	logoutUser: () => void
	setHydrated: () => void
}

const useAuthStore = create<AuthStore>()(
	persist(
		(set) => ({
			user: null,
			token: null,
			isHydrated: false,
			twofa: null,

			loginUser: (userData, token, persistToken, twofa) => {
				console.log("🔐 loginUser called", { userData, persistToken })
				storeUserToken(token, persistToken)
				set({ user: userData, token, twofa })
				console.log("✅ User set in store:", userData)
				setTimeout(() => {
					const stored = localStorage.getItem("auth-storage")
					console.log("📦 localStorage content:", stored)
				}, 100)
			},

			logoutUser: () => {
				console.log("🚪 Logging out user")
				clearAuthTokens()
				set({ user: null, token: null })
				localStorage.removeItem("auth-storage")
			},

			setHydrated: () => {
				console.log("💧 Store hydrated")
				set({ isHydrated: true })
			},
		}),
		{
			name: "auth-storage",
			storage: createJSONStorage(() => {
				if (typeof window !== "undefined") {
					return localStorage
				}
				return {
					getItem: () => null,
					setItem: () => {},
					removeItem: () => {},
				}
			}),
			partialize: (state) => ({ user: state.user, token: state.token }),
			onRehydrateStorage: () => {
				console.log("🔄 Starting rehydration...")
				return (state) => {
					console.log("✅ Rehydration complete. User:", state?.user)
					state?.setHydrated()
				}
			},
		},
	),
)

export const isTenant = () => {
	const user = useAuthStore.getState().user
	return user?.role === "tenant" || user?.role === "TENANT"
}

export const isAdmin = () => {
	const user = useAuthStore.getState().user
	return user?.role === "admin"
}

export const isGuest = () => {
	/*
  const user = useAuthStore.getState().user
  return user?.role === "guest"
*/
}

export default useAuthStore
