import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
})

const http = {
  post: axiosInstance.post,
  get: axiosInstance.get,
  patch: axiosInstance.patch,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
}

let isRefreshing = false
let failedRequestsQueue: Array<() => void> = []

export const setAuthTokenHeader = (accessToken: string) => {
  axiosInstance.defaults.headers.common.Authorization = accessToken.startsWith(
    "Bearer "
  )
    ? accessToken
    : `Bearer ${accessToken}`
}

export default http
