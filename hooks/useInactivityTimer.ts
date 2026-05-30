"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import useAuthStore from "@/store/auth"

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes

const ACTIVITY_EVENTS = [
	"mousemove",
	"mousedown",
	"keydown",
	"touchstart",
	"scroll",
	"click",
] as const

export function useInactivityTimer() {
	const router = useRouter()
	const { logoutUser, token } = useAuthStore()
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		if (!token) return

		const resetTimer = () => {
			if (timerRef.current) clearTimeout(timerRef.current)

			timerRef.current = setTimeout(() => {
				logoutUser()
				toast.error("Session expired due to inactivity. Please log in again.")
				router.replace("/auth")
			}, INACTIVITY_TIMEOUT_MS)
		}

		resetTimer()

		ACTIVITY_EVENTS.forEach((event) => {
			window.addEventListener(event, resetTimer, { passive: true })
		})

		return () => {
			if (timerRef.current) clearTimeout(timerRef.current)
			ACTIVITY_EVENTS.forEach((event) => {
				window.removeEventListener(event, resetTimer)
			})
		}
	}, [token, logoutUser, router])
}
