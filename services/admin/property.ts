import { Property } from "@/store/admin/properties"
import { adminEndpoints } from "../endpoint"
import http from "../https"

export interface AddPropertyPayload {
	name: string
	type: string
	price: number
	address: string
	state: string
	city: string
	zip: string
	amenities: string[]
	images: string[]
	noOfFloors: number
	noOfUnitsPerFloor: number
}

interface UploadLeasePayload {
	tenantId: string
	unitId: string
	rentAmount: number
	serviceCharge: number
	startDate: string
	endDate: string
	moveOutNotice: string
	documentUrl: string
}

export interface addMemberPayload {
	propertyId: string
	data: {
		userId: string
		role: string
		unitId: string
		rentAmount: number
		leaseMonths: number
	}
}

export const addProperty = async (payload: AddPropertyPayload) => {
	const response = await http.post(adminEndpoints.fetchProperties, payload)
	return response.data.data as Promise<Property>
}

export const uploadLease = async (payload: UploadLeasePayload) => {
	const response = await http.post(adminEndpoints.uploadLease, payload)
	return response.data.data as Promise<Property>
}

export const addMember = async (payload: addMemberPayload) => {
	const response = await http.post(
		adminEndpoints.addMember(payload.propertyId),
		payload.data,
	)
	return response.data.data as Promise<Property>
}
