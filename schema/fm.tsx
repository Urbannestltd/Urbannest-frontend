import * as z from 'zod'
import { ca } from 'zod/v4/locales';

const selectArrayField = (msg: string) => z.array(z.string()).min(1, msg).default([]);
const inputField = (msg: string) => z.string().min(1, msg);
const number = (msg: string) => z.coerce.number().refine((v) => v > 0, { message: msg });
const boolean = (msg: string) => z.boolean().default(false);

export const propertyFilterSchema = z.object({
    property: selectArrayField("Property is required"),
    occupancy: selectArrayField("Occupancy is required"),
    noOfUnits: selectArrayField("Number of units is required"),
})

export const ticketFilterSchema = z.object({
    property: selectArrayField("Property is required"),
    status: selectArrayField("Status is required"),
    dateRange: selectArrayField("Date range is required"),
    category: selectArrayField("Category is required"),
    priority: selectArrayField("Priority is required"),
})

export const addExpenseSchema = z.object({
    date: inputField("Date is required"),
    amount: number("Amount is required"),
    description: inputField("Description is required"),
})

export const visitorFilterSchema = z.object({
    property: selectArrayField("Property is required"),
    status: selectArrayField("Status is required"),
    accessType: selectArrayField("Access type is required"),
    dateRange: selectArrayField("Date range is required"),
})

export const PersonalInfoSchema = z.object({
    fullName: inputField("Full name is required"),
    emailAddress: inputField("Email address is required"),
    phoneNumber: inputField("Phone number is required"),
    emergencyContact: inputField("Emergency contact is required"),
})


export const NotifPreferenceSchema = z.object({
    fmEmailNewTicket: boolean("Email new ticket is required"),
    fmEmailTenantMessage: boolean("Email tenant message is required"),
    fmEmailAdminNote: boolean("Email admin note is required"),
    fmEmailBudgetResponse: boolean("Email budget response is required"),
    fmEmailNewAgentVisit: boolean("Email new agent visit is required"),
    fmEmailAgentReschedule: boolean("Email agent reschedule is required"),
})


export type PropertyFilterFormData = z.infer<typeof propertyFilterSchema>
export type TicketFilterFormData = z.infer<typeof ticketFilterSchema>
export type AddExpenseFormData = z.infer<typeof addExpenseSchema>
export type VisitorFilterFormData = z.infer<typeof visitorFilterSchema>
export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>
export type NotificationFormData = z.infer<typeof NotifPreferenceSchema>