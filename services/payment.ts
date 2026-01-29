import toast from "react-hot-toast"
import endpoints from "./endpoint"
import http from "./https"

export interface PaymentResponse {
  success: boolean
  message: string
  data: {
    reference: string
    url: string
  }
}
export interface PayRentPayload {
  isRenewal: boolean
  unitId: string
  durationUnit: string
  durationValue: number
  amount: number
}

export interface VerifyPaymentResponse {
  message: string
  details: {
    body: {
      message: string
    }
  }
}

export const payRent = async (payload: PayRentPayload) => {
  const response = await http.post(endpoints.payRent, payload)
  return response.data as Promise<PaymentResponse>
}

export const verifyPayment = async (reference: string) => {
  try {
    const response: VerifyPaymentResponse = await http.post(
      endpoints.paymentVerification,
      { reference },
    )
    if (response.details.body.message) {
      toast.success(response.message)
    }
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Payment verification failed"

    toast.error(message)
  } finally {
    localStorage.removeItem("payment_reference")
  }
}
