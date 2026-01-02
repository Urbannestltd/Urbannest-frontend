export interface User {
  email: string
  password: string
  fullName: string
  phone: string
  displayName: string
  rememberMe: boolean
}
export interface UserLoginResponse {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}
