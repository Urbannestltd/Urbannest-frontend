import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.NEXT_API_URL,
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
