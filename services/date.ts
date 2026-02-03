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
	if (!number) return null
	return number.toLocaleString("en-NG", {
		style: "currency",
		currency: "NGN",
		minimumFractionDigits: 0,
	})
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
		return ""
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

export const formatDatetoTime = (dateStr: string | undefined) => {
	if (!dateStr) {
		return ""
	}
	const date = new Date(dateStr)
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
