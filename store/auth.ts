import { create } from "zustand"
import { persist } from "zustand/middleware"
import { UserLoginResponse } from "../utils/model"
import {
  clearAuthTokens,
  storeRefreshToken,
  storeUserToken,
} from "@/services/cookies"

export interface AuthStore {
  user: UserLoginResponse | null
  setUser: (user: UserLoginResponse) => void
  loginUser: (
    userData: UserLoginResponse,
    accessToken: string,
    refreshToken: string,
    persistToken: boolean
  ) => void
  logoutUser: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      loginUser: (userData, accessToken, refreshToken, persistToken) => {
        storeUserToken(accessToken, persistToken)
        storeRefreshToken(refreshToken, persistToken)
        set({ user: userData })
      },
      logoutUser: () => {
        clearAuthTokens()
        set({ user: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
)

export const isTenant = () => {
  const user = useAuthStore.getState().user
  return user?.role === "tenant"
}

export const isAdmin = () => {
  // typeof window !== 'undefined' && window.location.pathname.includes('/user');
  const user = useAuthStore.getState().user
  return user?.role === "admin"
}

export const isGuest = () => {
  const user = useAuthStore.getState().user
  return user?.role === "guest"
}

export default useAuthStore
