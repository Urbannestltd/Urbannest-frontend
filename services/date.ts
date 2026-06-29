export const formatDateDash = (date: string | undefined) => {
	if (!date) {
		return "no date"
	}
	const formatted = new Date(date)
		.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		})
		.replace(/\//g, "-")

	return formatted
}

export const formatDateRegular = (dateStr: string | undefined) => {
	if (!dateStr) {
		return ""
	}
	const [day, month, year] = dateStr.split("-")

	const date = new Date(
		Number(`20${year}`), // year → 2025
		Number(month) - 1, // month index
		Number(day),
	)

	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	})
}

export const formatNumber = (number: number | string | undefined) => {
	if (!number) return "₦0"
	return number.toLocaleString("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
	})
}

export const formatNumberRegular = (value: string | number) => {
	if (!value) return ""
	return value.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ")
}

export const formatDateTime = (dateStr: string | undefined) => {
	if (!dateStr) {
		return ""
	}
	const date = new Date(dateStr)
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export const formatDate = (dateStr: string | undefined) => {
	if (!dateStr) {
		return null
	}
	const date = new Date(dateStr)
	return date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	})
}

export const formatDateToIso = (dateStr: string | undefined) => {
	if (!dateStr) {
		return ""
	}
	const date = new Date(dateStr)
	return date.toISOString()
}

export const formatDatetoTime = (
	dateStr: string | undefined,
	ampm?: boolean,
) => {
	if (!dateStr) {
		return "-"
	}
	const date = new Date(dateStr)
	if (ampm) {
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		})
	}
	return date.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
	})
}

export const formatDaysToYears = (days: number | undefined) => {
	if (!days) {
		return ""
	}
	const years = Math.floor(days / 365)
	const remainingDays = days % 365

	if (years === 0) return `${remainingDays} days`
	if (remainingDays === 0) return `${years} year${years > 1 ? "s" : ""}`

	return `${years} year${years > 1 ? "s" : ""}`
}

export const diffInDays = (
	startDate: string | undefined,
	endDate: string | undefined,
) => {
	if (!startDate || !endDate) {
		return 0
	}

	const start = new Date(startDate)
	const end = new Date(endDate)

	const ms = end.getTime() - start.getTime()
	return formatDaysToYears(Math.ceil(ms / (1000 * 60 * 60 * 24)))
}
export const getDateRange = (filter: string) => {
	const now = new Date()
	switch (filter) {
		case "today": {
			const start = new Date()
			start.setHours(0, 0, 0, 0)

			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			}
		}

		case "this_week": {
			const start = new Date()
			const day = start.getDay()
			const diff = start.getDate() - day + (day === 0 ? -6 : 1)

			start.setDate(diff)
			start.setHours(0, 0, 0, 0)

			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			}
		}

		case "this_month": {
			const start = new Date(now.getFullYear(), now.getMonth(), 1)

			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			}
		}

		case "this_year": {
			const start = new Date(now.getFullYear(), 0, 1)

			return {
				startDate: start.toISOString(),
				endDate: now.toISOString(),
			}
		}

		default:
			return {}
	}
}

export const convertMinutes = (totalMinutes: number) => {
	if (!totalMinutes) {
		return "-"
	}
	const totalSeconds = totalMinutes * 60

	const days = Math.floor(totalSeconds / (24 * 3600))
	const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)

	return `${days}d ${hours}h ${minutes}m `
}

export const stringToNumber = (val: string | number | undefined) => {
	if (val === undefined || val === null) return 0
	return parseFloat(String(val).replace("%", "")) || 0
}

export const leaseExpiry = (row: number) => {
	if (row >= 0 && row <= 40) {
		return "#EC221F"
	}
	if (row >= 41 && row <= 70) {
		return "#E8B931"
	}
	if (row >= 71) {
		return "#14AE5C"
	}
	return ""
}

export const formatCompactCurrency = (value: number) => {
	if (value >= 1000 && value < 1000000) return `₦${(value / 1000).toFixed(1)}k`
	if (value >= 1000000) return `₦${(value / 1000000).toFixed(1)}M`
	return formatNumber(value)
}

export const getFinancialDateRange = (filter: string) => {
	if (filter === "last_30_days") {
		const end = new Date()
		const start = new Date()
		start.setDate(end.getDate() - 30)

		return {
			startDate: start.toISOString(),
			endDate: end.toISOString(),
		}
	}

	return getDateRange(filter)
}

export const getNumberRange = (value?: string) => {
	if (!value || value === "all") return undefined

	const [min, max] = value.split("-").map((item) => Number(item.trim()))

	if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined

	return { min, max }
}
