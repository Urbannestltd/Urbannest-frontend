import { remove, update } from "lodash"
import { deleteFloor, uploadLease } from "./admin/property"
import { activateUser } from "./admin/user"
import { exportTickets } from "./admin/maintenance"

const endpoints = {
	storeFile: "/storage/sign-url",
	//Auth endpoints
	userLogin: "/auth/login",
	createUser: "/admin/create-user",
	forgotPassword: "/auth/forgot-password",
	resetPassword: "/auth/reset-password",
	validateToken: "/auth/validate-token",
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

const adminEndpoints = {
	//Dashboard
	fetchDashboard: `/admin/dashboard/metrics`,
	fetchUSers: `/admin/dashboard/tenants/status`,

	//Property endpoints
	fetchProperties: `/admin/dashboard/properties/overview`,
	createProperty: `/admin/properties`,
	fetchProperty: (id: string) => `/admin/properties/${id}`,
	deleteProperty: (id: string) => `/admin/properties/${id}`,
	fetchUnits: (id: string) => `/admin/units/${id}/units`,
	deleteUnit: (id: string) => `/admin/units/${id}`,
	editUnit: (id: string) => `/admin/units/unit/${id}`,
	fetchTenant: (id: string) => `/admin/units/${id}`,
	fetchLease: (id: string) => `/admin/leases/${id}`,
	updateLease: (id: string) => `/admin/leases/${id}`,
	uploadLease: `/admin/leases`,
	renewLease: (id: string) => `/admin/leases/${id}/renew`,
	deleteFloor: (id: string) => `/admin/units/${id}/floor`,

	//Financial Endpoint
	fetchFinancials: `/admin/payments`,
	exportFinancials: `/admin/payments/export`,
	createExpense: `/admin/expenses`,
	fetchFinancialDashboard: `/admin/payments/metrics`,
	//MEmebr
	addMember: `/admin/create-user`,
	removeMember: (id: string) => `/admin/properties/${id}/members/remove`,

	//Tickets
	fetchAllTickets: `/admin/properties/tickets`,
	fetchTicketsPerProperty: (id: string) => `/admin/properties/${id}/tickets`,
	fetchTicketMetrics: `/admin/properties/tickets/metrics`,
	fetchTicket: (id: string) => `/admin/properties/tickets/${id}`,
	exportTickets: `/admin/properties/tickets/export`,
	updateStatus: (id: string) => `/admin/properties/tickets/${id}/status`,
	postComments: (id: string) => `/admin/properties/tickets/${id}/comments`,
	updateBudget: (id: string) => `/admin/properties/tickets/${id}/budget`,
	approveCost: (id: string) => `/admin/properties/tickets/${id}/approve`,
	rejectCost: (id: string) => `/admin/properties/tickets/${id}/reject`,
	offerRebuttal: (id: string) => `/admin/properties/tickets/${id}/rebuttal`,
	createBudget: `/admin/settings/system`,

	//Users
	fetchUsers: `/admin/users`,
	fetchUser: (id: string) => `/admin/users/${id}`,
	fetchUserMetrics: `/admin/users/metrics`,
	fetchActivities: (id: string) => `/admin/users/${id}/activity`,
	suspendUser: (id: string) => `/admin/users/${id}/suspend`,
	activateUser: (id: string) => `/admin/users/${id}/activate`,
	updatePermissions: (id: string) => `/admin/users/${id}/permissions`,
	deleteUser: (id: string) => `/admin/users/${id}`,

	//Settings endpoints
	getNotifPreference: `/admin/settings/notifications`,
	updateNotifPreference: `/admin/settings/notifications`,
	changePassword: `/admin/settings/password`,
}

export { adminEndpoints }

const FmEndpoints = {
	//Dashboard
	fetchDashboardSummary: `/facility-manager/dashboard/summary`,
	fetchDashboardVisitors: `/facility-manager/dashboard/visitors`,
	fetchDashboardTickets: `/facility-manager/dashboard/tickets`,

	//Properties
	fetchProperties: `/facility-manager/properties`,
	fetchProperty: (id: string) => `/facility-manager/properties/${id}`,
	fetchUnits: (id: string) => `/facility-manager/properties/${id}/units`,
	fetchTenant: (id: string, tenantId: string) =>
		`/facility-manager/properties/${id}/tenants/${tenantId}`,

	//Tickets
	fetchAllTickets: `/facility-manager/tickets`,
	fetchTicketsPerProperty: (id: string) =>
		`/facility-manager/tickets/property/${id}`,
	fetchTicket: (id: string) => `/facility-manager/tickets/${id}`,
	updateStatus: (id: string) => `/facility-manager/tickets/${id}/status`,
	updatePriority: (id: string) => `/facility-manager/tickets/${id}/priority`,
	postComments: (id: string) => `/facility-manager/tickets/${id}/message`,
	getExpenses: (id: string) => `/facility-manager/tickets/${id}/expenses`,
	fetchBudget: (id: string) => `/facility-manager/tickets/${id}/budget`,
}

export { FmEndpoints }
