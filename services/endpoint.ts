const endpoints = {
	storeFile: "/storage/sign-url",
	//Auth endpoints
	userLogin: "/auth/login",
	createUser: "/admin/create-user",
	forgotPassword: "/auth/forgot-password",
	resetPassword: "/auth/reset-password",

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

	//Maintenances endpoints
	getMaintenanceRequests: `/maintenance/history`,
	createMaintenanceRequest: `/maintenance/submit`,
	editMaintenanceRequest: (id: string) => `/maintenance/${id}`,
	sendMaintenanceMessage: (ticketId: string) =>
		`/maintenance/${ticketId}/message`,
	getAllMaintenanceRequestsMessages: (ticketId: string) =>
		`/maintenance/${ticketId}/messages`,

	//Settings endpoints
	getSettings: `/settings/profile`,
	updateSettings: `/settings/profile`,
	getNotifPreference: `/settings/notifications`,
	updateNotifPreference: `/settings/notifications`,
	getReminders: `/settings/reminders`,
	deleteReminder: (id: string) => `/settings/reminders/${id}`,

	//Suuport Center endpoints
	createTicket: `/support/create`,
	getTicket: (id: string) => `/support/${id}`,
	sendTicketMessage: (id: string) => `/support/${id}/reply`,
}

export default endpoints
