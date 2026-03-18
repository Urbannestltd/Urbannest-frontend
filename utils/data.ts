import dashboardIcon from "@/app/assets/icons/tenant-sidebar-icons/dashboard-icon.svg"
import leaseIcon from "@/app/assets/icons/tenant-sidebar-icons/lease-icon.svg"
import maintenanceIcon from "@/app/assets/icons/tenant-sidebar-icons/maintenance-icon.svg"
import visitorIcon from "@/app/assets/icons/tenant-sidebar-icons/vistor-icon.svg"
import financialIcon from "@/app/assets/icons/admin-sidebar-icons/financials.svg"
import userIcon from "@/app/assets/icons/admin-sidebar-icons/user-management-icon.svg"
import leaseImage from "@/app/assets/images/lease-image.png"
import {
	LeaseAgreement,
	Maintance,
	MessageCardProps,
	notification,
	Properties,
	userData,
} from "./model"

export const sidebarLinks = [
	{
		title: "Dashboard",
		href: "/tenant/dashboard",
		icon: dashboardIcon,
		value: "dashboard",
	},
	{
		title: "Lease & Payments",
		href: "/tenant/lease",
		icon: leaseIcon,
		value: "lease",
	},
	{
		title: "Maintenance & Issues",
		href: "/tenant/maintenance",
		icon: maintenanceIcon,
		value: "maintenance",
	},
	{
		title: "Visitor Management",
		href: "/tenant/visitors",
		icon: visitorIcon,
		value: "visitors",
	},
]
export const adminSidebarLinks = [
	{
		title: "Dashboard",
		href: "/admin/dashboard",
		icon: dashboardIcon,
		value: "dashboard",
	},
	{
		title: "Financials",
		href: "/admin/financials",
		icon: financialIcon,
		value: "financials",
	},
	{
		title: "Maintenance & Issues",
		href: "/admin/maintenance",
		icon: maintenanceIcon,
		value: "maintenance",
	},
	{
		title: "User Management",
		href: "/admin/user-management",
		icon: userIcon,
		value: "user-management",
	},
]
export const VistorData: userData = {
	id: 1,
	firstName: "John",
	lastName: "Doe",
	email: "lVjRt@example.com",
	rent: "₦12,000,000",
	visitors: [
		{
			id: 1,
			visitorName: "John Doe",
			email: "lVjRt@example.com",
			visitorPhone: "08123456789",
			status: "checked-out",
			access: "one-off",
			timeIn: "10:00 AM",
			timeOut: "12:00 PM",
		},
		{
			id: 2,
			visitorName: "Rose Doe",
			email: "lVjRt@example.com",
			visitorPhone: "08123456789",
			status: "checked-in",
			access: "one-off",
			timeIn: "10:00 AM",
			timeOut: "12:00 PM",
		},
		{
			id: 3,
			visitorName: "Temi Kalaro",
			email: "lVjRt@example.com",
			visitorPhone: "08123456789",
			status: "checked-in",
			access: "one-off",
			timeIn: "10:00 AM",
			timeOut: "12:00 PM",
		},
	],
}

export const notificationsinfo: notification[] = [
	{
		title: "Your Visitor Has Arrived!",
		message: "John, your scheduled visitor, has arrived and is at the gate.",
		type: "visitor",
		status: "success",
		date: "12-11-23",
	},
	{
		title: "Lease Renewal Coming Up",
		message:
			"Your lease ends in 60 days. Review your renewal options to avoid last-minute stress.",
		type: "lease",
		status: "info",
		date: "12-11-23",
	},
	{
		title: "Your lease expires soon",
		message:
			"Your lease ends in 30 days. Take action if you plan to renew or move out.",
		type: "lease",
		status: "info",
		date: "12-11-23",
	},
	{
		title: "Lease expires today",
		message:
			"Today is the last day of your lease. Check your lease status for next steps.",
		type: "lease",
		status: "info",
		date: "12-11-23",
	},
	{
		title: "Lease renewed",
		message: "Your lease has been renewed",
		type: "lease",
		status: "success",
		date: "12-11-23",
	},
	{
		title: "Payment Success",
		message: "Your payment for electricity has been made",
		type: "payment",
		status: "success",
		date: "12-11-23",
	},
]

export const maintenanceRequest: Maintance[] = [
	{
		issue: "Glitching Lights in kitchen",
		type: "electrical",
		status: "pending",
		date: "12-11-23",
		description:
			"Plsssss water has spilled, we need you guys to send someone to clean it up, thank youuuuuuu",
	},
	{
		issue: "AC not getting cold",
		type: "hvc-ac",
		status: "in-progress",
		date: "12-11-23",
		description:
			"Plsssss water has spilled, we need you guys to send someone to clean it up, thank youuuuuuu",
	},
	{
		issue: "Water is Leaking",
		type: "plumbing",
		status: "work-scheduled",
		date: "12-11-23",
		description:
			"Plsssss water has spilled, we need you guys to send someone to clean it up, thank youuuuuuu",
	},
	{
		issue: "The floors are filthy and dusty",
		type: "cleaning",
		status: "fixed",
		date: "12-11-23",
		description:
			"Plsssss water has spilled, we need you guys to send someone to clean it up, thank youuuuuuu",
	},
]

export const messages: MessageCardProps[] = [
	{
		id: "msg-001",
		ticketId: "ticket-101",
		senderId: "user-001",
		readAt: "2026-01-22T10:15:00.000Z",
		createdAt: "2026-01-22T10:10:00.000Z",
		message:
			"Hello, I’m having issues with my rent payment reflecting on my dashboard.",
		attachments: [],
		sender: {
			userId: "user-001",
			userFullName: "Teniola Kalaro",
			userRole: {
				roleId: "role-tenant",
				roleName: "Tenant",
				roleDescription: "Tenant user with lease access",
				roleStatus: "ACTIVE",
				roleCreatedAt: "2025-06-01T08:00:00.000Z",
				roleUpdatedAt: "2025-12-15T12:30:00.000Z",
			},
		},
	},
	{
		id: "msg-002",
		ticketId: "ticket-101",
		senderId: "user-002",
		readAt: "2026-01-22T10:25:00.000Z",
		createdAt: "2026-01-22T10:20:00.000Z",
		message:
			"Hi Teniola, thanks for reaching out. Could you please confirm the payment date?",
		attachments: [],
		sender: {
			userId: "user-002",
			userFullName: "UrbanNest Support",
			userRole: {
				roleId: "role-admin",
				roleName: "Admin",
				roleDescription: "System administrator and support agent",
				roleStatus: "ACTIVE",
				roleCreatedAt: "2024-01-10T09:00:00.000Z",
				roleUpdatedAt: "2025-11-01T14:45:00.000Z",
			},
		},
	},
	{
		id: "msg-003",
		ticketId: "ticket-101",
		senderId: "user-001",
		readAt: "",
		createdAt: "2026-01-22T10:30:00.000Z",
		message:
			"Yes, the payment was made on the 21st via Paystack. I’ve attached the receipt.",
		attachments: ["https://example.com/attachments/payment-receipt.pdf"],
		sender: {
			userId: "user-001",
			userFullName: "Teniola Kalaro",
			userRole: {
				roleId: "role-tenant",
				roleName: "Tenant",
				roleDescription: "Tenant user with lease access",
				roleStatus: "ACTIVE",
				roleCreatedAt: "2025-06-01T08:00:00.000Z",
				roleUpdatedAt: "2025-12-15T12:30:00.000Z",
			},
		},
	},
]

export const propertiess: Properties[] = [
	{
		name: "Property 1",
		owner: "John Doe",
		address: "123 Main St, Anytown, USA",
		unit: "Apt 101",
		unitId: "A101",
		image: leaseImage,
		occupancy: 35,
		complaints: 82,
		date: "2023-01-01",
		fullAddress: "123 Main St, Anytown, USA, Apt 101",
		rent: 1000000,
		noOfUnits: 10,
	},
	{
		name: "Property 2",
		owner: "Jane Smith",
		address: "456 Elm St, Anytown, USA",
		unit: "Apt 202",
		unitId: "A202",
		image: leaseImage,
		occupancy: 73,
		complaints: 1,
		date: "2023-01-02",
		fullAddress: "456 Elm St, Anytown, USA, Apt 202",
		rent: 1200000,
		noOfUnits: 8,
	},
	{
		name: "Property 3",
		owner: "Bob Johnson",
		address: "789 Oak St, Anytown, USA",
		unit: "Apt 303",
		unitId: "A303",
		image: leaseImage,
		occupancy: 64,
		complaints: 10,
		date: "2023-01-03",
		fullAddress: "789 Oak St, Anytown, USA, Apt 303",
		rent: 1500000,
		noOfUnits: 7,
	},
	{
		name: "Property 4",
		owner: "Alice Williams",
		address: "101 Pine St, Anytown, USA",
		unit: "Apt 404",
		unitId: "A404",
		image: leaseImage,
		occupancy: 20,
		complaints: 40,
		date: "2023-01-04",
		fullAddress: "101 Pine St, Anytown, USA, Apt 404",
		rent: 800000,
		noOfUnits: 5,
	},
	{
		name: "Property 5",
		owner: "Charlie Brown",
		address: "202 Maple St, Anytown, USA",
		unit: "Apt 505",
		unitId: "A505",
		image: leaseImage,
		occupancy: 90,
		complaints: 70,
		date: "2023-01-05",
		fullAddress: "202 Maple St, Anytown, USA, Apt 505",
		rent: 1800000,
		noOfUnits: 10,
	},
	{
		name: "Property 6",
		owner: "Emily Davis",
		address: "303 Cedar St, Anytown, USA",
		unit: "Apt 606",
		unitId: "A606",
		image: leaseImage,
		occupancy: 50,
		complaints: 30,
		date: "2023-01-06",
		fullAddress: "303 Cedar St, Anytown, USA, Apt 606",
		rent: 1100000,
		noOfUnits: 10,
	},
]

export const leaseAgreements: LeaseAgreement[] = [
	{
		name: "The Principal Towers",
		startDate: "Jan 01, 2025",
		endDate: "Dec 31, 2025",
		leaseAgreement: "https://example.com/lease-agreement-1.pdf",
	},
	{
		name: "The Principal Towers",
		startDate: "Jan 01, 2025",
		endDate: "Dec 31, 2025",
		leaseAgreement: "https://example.com/lease-agreement-2.pdf",
	},
	{
		name: "The Principal Towers",
		startDate: "Jan 01, 2025",
		endDate: "Dec 31, 2025",
		leaseAgreement: "https://example.com/lease-agreement-3.pdf",
	},
	{
		name: "The Principal Towers",
		startDate: "Jan 01, 2025",
		endDate: "Dec 31, 2025",
		leaseAgreement: "https://example.com/lease-agreement-4.pdf",
	},
]
