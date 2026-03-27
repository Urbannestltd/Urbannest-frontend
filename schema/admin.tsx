import * as z from 'zod'
import { da } from 'zod/v4/locales';

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

export const AddUnitSchema = z.object({
    name: inputField("Unit name is required"),
    type: selectArrayField("Unit type is required"),
    floor: selectArrayField("Floor is required"),
    property: inputField("Property is required"),
})

export type addPropertyFormData = z.infer<typeof addPropertySchema>
export type addUnitFormData = z.infer<typeof AddUnitSchema>