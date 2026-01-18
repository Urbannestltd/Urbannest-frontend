import * as z from 'zod'
import { da } from 'zod/v4/locales';

const selectArrayField = (msg: string) => z.array(z.string()).min(1, msg).default([]);
const inputField = (msg: string) => z.string().min(1, msg);
const number = (msg: string) => z.coerce.number().refine((v) => v > 0, { message: msg });

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
    dateExpected: inputField("Date expected is required"),
})

export const addVisitorGroupsSchema = z.object({
    groupName: inputField("Full name is required"),
    contactNumber: inputField("Phone number is required"),
    visitorType: selectArrayField("Visitor type is required"),
    accessType: selectArrayField("Access type is required"),
    timeExpected: inputField("Time expected is required"),
    dateExpected: inputField("Date expected is required"),
    visitorlist: z.array(z.string()).min(1, "Visitor list is required"),
})


export type addVisitorFormData = z.infer<typeof addVisitorSchema>
export type addVisitorGroupsFormData = z.infer<typeof addVisitorGroupsSchema>

export type loginFormData = z.input<typeof loginSchema>
export type registerFormData = z.infer<typeof registerSchema>