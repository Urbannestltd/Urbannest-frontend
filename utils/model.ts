export interface User {
	id: string
	email?: string
	password?: string
	name: string
	profilePic?: string
	role: "admin" | "tenant" | "ADMIN" | "TENANT"
	phone?: string
	displayName?: string
	lease?: LeaseDetails
	rememberMe: boolean
}
export interface UserLoginResponse {
	user: User
	token: string
	tempToken: string
	require2fa: boolean
	message: string
}

export interface userData {
	id: number
	firstName: string
	lastName: string
	email: string
	rent: string
	visitors: {
		id: number
		name: string
		email: string
		phone: string
		status: string
		access: string
		timeIn: string
		timeOut: string
	}[]
}

export interface notification {
	title: string
	message: string
	date: string
	type: "visitor" | "lease" | "payment"
	status: "success" | "error" | "info"
}

export interface LeaseDetails {
	id: string
	status: "ACTIVE" | "TERMINATED" | "EXPIRED"
	property: {
		fullAddress: string
		address: string
		unit: string
		unitId: string
		name: string
	}
	contract: {
		currency: string
		rentAmount: number
		daysRemaining: number
		endDate: string
		startDate: string
	}
	document: {
		canDownload: boolean
		url: string
	}
}

export interface Maintance {
	issue: string
	type: string
	status: string
	date: string
	description?: string
}

export interface MessageCardProps {
	sender: {
		userRole: {
			roleUpdatedAt: string
			roleCreatedAt: string
			roleStatus: string
			roleDescription: string
			roleName: string
			roleId: string
		}
		userFullName: string
		userId: string
	}
	readAt: string
	ticketId: string
	senderId: string
	attachments: string[]
	message: string
	createdAt: string
	id: string
}
