const endpoints = {
	storeFile: "/storage/sign-url",
	//Auth endpoints
	userLogin: "/auth/login",
	createUser: "/admin/create-user",
	forgotPassword: "/auth/forgot-password",
	resetPassword: "/auth/reset-password",

	//Dashboard endpoints
	fetchDashboardData: "/dashboard/overview",

	//Lease endpoints
	getCurrentLease: `/leases/current`,
	downloadLease: (id: string) => `/leases/${id}/download`,

	//Utitlities endpoints
	verifyMeter: `/utilities/verify-meter`,
	purchaseUtilities: `/utilities/purchase`,
	getSavedMeters: `/utilities/saved-meters`,
	deleteMeter: (id: string) => `/utilities/saved-meters/${id}`,

	//Rent endpoints
	payRent: `/rent/pay`,
	rentHistory: `/rent/history`,
	paymentVerification: `/payments/verify`,

	//Visitor endpoints
	getVisitors: `/visitors/history`,
	visitorAccess: `/visitors/check-in`,
	verifyVisitor: `/visitors/verify`,
	inviteVisitor: `/visitors/invite`,
	inviteGroupVisitor: `/visitors/invite/bulk`,
	getVisitorsDashboard: `/visitors/stats`,

	//Maintenances endpoints
	getMaintenanceRequests: `/maintenance/history`,
	createMaintenanceRequest: `/maintenance/submit`,
	editMaintenanceRequest: (id: string) => `/maintenance/${id}`,
	sendMaintenanceMessage: (ticketId: string) =>
		`/maintenance/${ticketId}/message`,
	getAllMaintenanceRequestsMessages: (ticketId: string) =>
		`/maintenance/${ticketId}/messages`,
	deleteMaintenanceRequest: (ticketId: string) => `/maintenance/${ticketId}`,

	//Settings endpoints
	getSettings: `/settings/profile`,
	updateSettings: `/settings/profile`,
	getNotifPreference: `/settings/notifications`,
	updateNotifPreference: `/settings/notifications`,
	getReminders: `/settings/reminders`,
	deleteReminder: (id: string) => `/settings/reminders/${id}`,
	changePassword: `/settings/change-password`,
	enable2fa: `/settings/2fa/enable`,
	disable2fa: `/settings/2fa/disable`,
	confirmOtp: `/settings/2fa/confirm`,

	//Suuport Center endpoints
	createTicket: `/support/create`,
	getTicket: (id: string) => `/support/${id}`,
	sendTicketMessage: (id: string) => `/support/${id}/reply`,
}

export default endpoints
