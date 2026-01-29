import toast from "react-hot-toast"
import endpoints from "./endpoint"
import http from "./https"
import axios from "axios"

export interface VerifyMeterPayload {
	meterNumber: string
	type: string
	serviceID: string
}

export interface VerifyMeterResponse {
	success: true
	message: string
	data: {
		valid: true
		address: string
		customerName: string
	}
}
export interface UtilityPaymentPayload {
	serviceID: string
	type: string
	meterNumber: string
	amount: number
	saveMeter: boolean
	label: string
}

export interface UtilityPaymentResponse {
	reference: string
	url: string
}

export const verifyMeter = async (
	payload: VerifyMeterPayload,
): Promise<VerifyMeterResponse> => {
	try {
		const response = await http.post(endpoints.verifyMeter, payload)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Meter verification failed",
			)
		}
		throw error
	}
}

export const purchaseElectricity = async (
	payload: UtilityPaymentPayload,
): Promise<UtilityPaymentResponse> => {
	const verifyPayload: VerifyMeterPayload = {
		serviceID: payload.serviceID,
		type: payload.type,
		meterNumber: payload.meterNumber,
	}
	const meterVerified = await verifyMeter(verifyPayload)

	if (!meterVerified.success) {
		throw new Error("Meter verification failed")
	}

	try {
		const response = await http.post(endpoints.purchaseUtilities, payload)
		return response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				error.response?.data?.message || "Electricity purchase failed",
			)
		}
		throw error
	}
}
