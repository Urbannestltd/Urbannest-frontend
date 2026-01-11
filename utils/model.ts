export interface User {
  email: string
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
