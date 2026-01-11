import * as z from 'zod'

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

export type loginFormData = z.input<typeof loginSchema>
export type registerFormData = z.infer<typeof registerSchema>