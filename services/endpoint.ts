const endpoints = {
	storeFile: "/storage/sign-url",
	//Auth endpoints
	userLogin: "/auth/login",
	createUser: "/admin/create-user",
	forgotPassword: "/auth/forgot-password",
	resetPassword: "/auth/reset-password",
	//payment verification

	paymentVerification: `/payments/verify`,
	//Dashboard endpoints
	fetchDashboardData: "/tenant/dashboard/overview",

	//Lease endpoints
	getCurrentLease: `/tenant/leases/current`,
	downloadLease: (id: string) => `/tenant/leases/${id}/download`,

	//Utitlities endpoints
	verifyMeter: `/tenant/utilities/verify-meter`,
	purchaseUtilities: `/tenant/utilities/purchase`,
	getSavedMeters: `/tenant/utilities/saved-meters`,
	deleteMeter: (id: string) => `/tenant/utilities/saved-meters/${id}`,

	//Rent endpoints
	payRent: `/tenant/rent/pay`,
	rentHistory: `/tenant/rent/history`,

	//Visitor endpoints
	getVisitors: `/tenant/visitors/history`,
	visitorAccess: `/tenant/visitors/check-in`,
	verifyVisitor: `/tenant/visitors/verify`,
	inviteVisitor: `/tenant/visitors/invite`,
	inviteGroupVisitor: `/tenant/visitors/invite/bulk`,
	getVisitorsDashboard: `/tenant/visitors/stats`,

	//Maintenances endpoints
	getMaintenanceRequests: `/tenant/maintenance/history`,
	createMaintenanceRequest: `/tenant/maintenance/submit`,
	editMaintenanceRequest: (id: string) => `/tenant/maintenance/${id}`,
	sendMaintenanceMessage: (ticketId: string) =>
		`/tenant/maintenance/${ticketId}/message`,
	getAllMaintenanceRequestsMessages: (ticketId: string) =>
		`/tenant/maintenance/${ticketId}/messages`,
	deleteMaintenanceRequest: (ticketId: string) =>
		`/tenant/maintenance/${ticketId}`,

	//Settings endpoints
	getSettings: `/tenant/settings/profile`,
	updateSettings: `/tenant/settings/profile`,
	getNotifPreference: `/tenant/settings/notifications`,
	updateNotifPreference: `/tenant/settings/notifications`,
	getReminders: `/tenant/settings/reminders`,
	deleteReminder: (id: string) => `/tenant/settings/reminders/${id}`,
	changePassword: `/tenant/settings/change-password`,
	enable2fa: `/tenant/settings/2fa/enable`,
	disable2fa: `/tenant/settings/2fa/disable`,
	confirmOtp: `/tenant/settings/2fa/confirm`,

	//Suuport Center endpoints
	createTicket: `/tenant/support/create`,
	getTicket: (id: string) => `/tenant/support/${id}`,
	sendTicketMessage: (id: string) => `/tenant/support/${id}/reply`,
}

export default endpoints
