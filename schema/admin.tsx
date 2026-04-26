import * as z from 'zod'

const selectArrayField = (msg: string) => z.array(z.string()).min(1, msg).default([]);
const inputField = (msg: string) => z.string().min(1, msg);
const number = (msg: string) => z.coerce.number().refine((v) => v > 0, { message: msg });
const boolean = (msg: string) => z.boolean().default(false);

export const addPropertySchema = z.object({
    propertyName: inputField("Property name is required"),
    propertyType: selectArrayField("Property type is required"),
    propertyPrice: number("Property price is required"),
    noOfFloors: number("Number of floors is required"),
    noOfUnitsPerFloor: number("Number of units per floor is required"),
    propertyAddress: inputField("Property address is required"),
    propertyState: inputField("Property state is required"),
    amenities: selectArrayField("Amenities is required"),
})

export const editPropertySchema = z.object({
    price: number("Property price is required"),
})

export const AddUnitSchema = z.object({
    name: inputField("Unit name is required"),
    type: selectArrayField("Unit type is required"),
    floor: selectArrayField("Floor is required"),
    property: inputField("Property is required"),
})

export const addExpenseSchema = z.object({
    property: selectArrayField("Property is required"),
    unit: selectArrayField("Unit is required"),
    paymentMethod: selectArrayField("Payment method is required"),
    date: inputField("Date is required"),
    amount: number("Amount is required"),
    description: inputField("Description is required"),
})

export const searchMaintenanceSchema = z.object({
    property: selectArrayField("Property is required"),
    status: selectArrayField("Status is required"),
    priority: selectArrayField("Priority is required"),
    issue: selectArrayField("Issue is required"),
    dateRange: selectArrayField("Date range is required"),
})

export const searchUsersSchema = z.object({
    role: selectArrayField("Role is required"),
    status: selectArrayField("Status is required"),
    dateRange: selectArrayField("Date range is required"),
})

export const filterSchema = z.object({
    property: selectArrayField("Property is required"),
    status: selectArrayField("Status is required"),
    dateRange: selectArrayField("Date range is required"),
    paymentMethod: selectArrayField("Payment method is required"),
})

export const permissionSchema = z.object({
    ACCESS_TENANT_PORTAL: boolean("Access tenant portal is required"),
    PAY_RENT_ONLINE: boolean("Pay rent online is required"),
    REQUEST_MAINTENANCE: boolean("Request maintenance is required"),
    VISITOR_ALLOWANCE: boolean("Visitor allowance is required"),
})

export const landlordPermissionSchema = z.object({
    VIEW_FINANCIALS_AND_REPORTS: boolean('View financials and reports'),
    MANAGE_PROPERTIES_AND_UNITS: boolean('Manage properties and units'),
    VIEW_TENANTS_AND_LEASES: boolean('View tenants and leases'),
    VIEW_MAINTENANCE_TICKETS: boolean('View maintenance tickets'),
    APPROVE_MAJOR_MAINTENANCE: boolean('Approve major maintenance'),
})

export const facilityManagerPermissionSchema = z.object({
    MANAGE_TICKETS: boolean('Manage tickets'),
    MANAGE_PROPERTIES_AND_UNITS: boolean('Manage properties and units'),
    APPROVE_MINOR_MAINTENANCE: boolean('Approve minor maintenance'),
    VIEW_TENANTS_AND_LEASES: boolean('View tenants and leases'),
})

export const adminPermissionSchema = z.object({
    financials: boolean("Financials is required"),
    properties: boolean("Properties is required"),
    maintenance: boolean("Maintenance is required"),
    userManagement: boolean("User management is required"),
})

export type addPropertyFormData = z.infer<typeof addPropertySchema>
export type editPropertyFormData = z.infer<typeof editPropertySchema>
export type addUnitFormData = z.infer<typeof AddUnitSchema>
export type addExpenseFormData = z.infer<typeof addExpenseSchema>
export type searchMaintenanceFormData = z.infer<typeof searchMaintenanceSchema>
export type searchUsersFormData = z.infer<typeof searchUsersSchema>
export type filterFormData = z.infer<typeof filterSchema>
export type permissionFormData = z.infer<typeof permissionSchema>
export type landlordPermissionFormData = z.infer<typeof landlordPermissionSchema>
export type facilityManagerPermissionFormData = z.infer<typeof facilityManagerPermissionSchema>
export type adminPermissionFormData = z.infer<typeof adminPermissionSchema>