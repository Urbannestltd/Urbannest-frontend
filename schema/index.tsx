import * as z from 'zod'
import { da } from 'zod/v4/locales';

const selectArrayField = (msg: string) => z.array(z.string()).min(1, msg).default([]);
const inputField = (msg: string) => z.string().min(1, msg);
const number = (msg: string) => z.coerce.number().refine((v) => v > 0, { message: msg });
const boolean = (msg: string) => z.boolean().default(false);

export const loginSchema = z.object({
    email: inputField("Email is required"),
    password: inputField("Password is required"),
    rememberMe: z.boolean().default(false),
});

export const registerSchema = z.object({
    userPassword: inputField("Password is required"),
    userFullName: inputField("Full name is required"),
    userDisplayName: inputField("Display name is required").optional(),
    userPhone: inputField("Phone number is required"),
    userRoleName: z.enum(["tenant", "admin"]).default("tenant"),
    rememberMe: z.boolean().default(false),
});

export const addVisitorSchema = z.object({
    fullName: inputField("Full name is required"),
    phoneNumber: inputField("Phone number is required"),
    visitorType: selectArrayField("Visitor type is required"),
    accessType: selectArrayField("Access type is required"),
    timeExpected: inputField("Time expected is required"),
    endDate: inputField("End date is required"),
    dateExpected: inputField("Date expected is required"),
})

export const VisitorListSchema = z.object({
    name: inputField("Full name is required"),
    phone: inputField("Phone number is required"),
})

export const addVisitorGroupsSchema = z.object({
    groupName: inputField("Full name is required"),
    contactNumber: inputField("Phone number is required"),
    visitorType: selectArrayField("Visitor type is required"),
    accessType: selectArrayField("Access type is required"),
    timeExpected: inputField("Time expected is required"),
    dateExpected: inputField("Date expected is required"),
    endDate: inputField("End date is required"),
    visitorlist: z.array(VisitorListSchema).min(1, "At least one visitor is required"),
})

export const MaintenanceRequestSchema = z.object({
    title: inputField("Title is required"),
    description: inputField("Description is required"),
    type: selectArrayField("Type is required"),
})

export const UtilitiesSchema = z.object({
    meterNumber: inputField("Meter number is required"),
    amount: number("Amount is required"),
    saveMeter: z.boolean(),
})

export const PersonalInfoSchema = z.object({
    fullName: inputField("Full name is required"),
    emailAddress: inputField("Email address is required"),
    phoneNumber: inputField("Phone number is required"),
    emergencyContact: inputField("Emergency contact is required"),
})
export const NotificationSchema = z.object({
    emailPayments: boolean("Payments is required"),
    emailLease: boolean("Lease is required"),
    emailMaintenance: boolean("Maintenance is required"),
    emailVisitors: boolean("Visitors is required"),
})

export const SecurityPrivacySchema = z.object({
    oldPassword: inputField("Old password is required"),
    newPassword: inputField("New password is required"),
    confirmPassword: inputField("Confirm password is required"),
    twofa: z.boolean(),
})

export const NeedHelpSchema = z.object({
    category: selectArrayField("Category is required"),
    description: inputField("Description is required"),
})

export type addVisitorFormData = z.infer<typeof addVisitorSchema>
export type addVisitorGroupsFormData = z.infer<typeof addVisitorGroupsSchema>
export type VisitorListFormData = z.infer<typeof VisitorListSchema>
export type MaintenanceRequestFormData = z.infer<typeof MaintenanceRequestSchema>
export type UtilitiesFormData = z.infer<typeof UtilitiesSchema>
export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>
export type NotificationFormData = z.infer<typeof NotificationSchema>
export type SecurityPrivacyFormData = z.infer<typeof SecurityPrivacySchema>
export type NeedHelpFormData = z.infer<typeof NeedHelpSchema>


export type loginFormData = z.input<typeof loginSchema>
export type registerFormData = z.infer<typeof registerSchema>