export interface User {
  id: string
  email?: string
  password?: string
  name: string
  role: string
  phone?: string
  displayName?: string
  rememberMe: boolean
}
export interface UserLoginResponse {
  user: User
  token: string
}

export interface userData {
  id: number
  firstName: string
  lastName: string
  email: string
  rent: string
  visitors: {
    id: number
    name: string
    email: string
    phone: string
    status: string
    access: string
    timeIn: string
    timeOut: string
  }[]
}

export interface notification {
  title: string
  message: string
  date: string
  type: "visitor" | "lease" | "payment"
  status: "success" | "error" | "info"
}
