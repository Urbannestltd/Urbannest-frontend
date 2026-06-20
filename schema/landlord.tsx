
import * as z from 'zod'

const selectArrayField = (msg: string) => z.array(z.string()).min(1, msg).default([]);
const inputField = (msg: string) => z.string().min(1, msg);
const number = (msg: string) => z.coerce.number().refine((v) => v > 0, { message: msg });
const boolean = (msg: string) => z.boolean().default(false);

export const propertyFilterSchema = z.object({
    property: selectArrayField("Property is required"),
    occupancy: selectArrayField("Occupancy is required"),
    noOfUnits: selectArrayField("Number of units is required"),
})

export const approvalFilterSchema = z.object({
    property: selectArrayField("Property is required"),
    dateRange: selectArrayField("Date range is required"),
})

export type PropertyFilterFormData = z.infer<typeof propertyFilterSchema>
export type ApprovalFilterFormData = z.infer<typeof approvalFilterSchema>