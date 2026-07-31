export type OrganizationType = 'CUSTOMER' | 'PROVIDER'

export type MembershipRole = 'OWNER' | 'MEMBER'

export type LoginCredentials = {
  email: string
  password: string
}

export type RegisterData = {
  firstName: string
  lastName: string
  email: string
  password: string
  organizationType: OrganizationType
  organizationName: string
}

export type AuthUser = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: MembershipRole
  organizationId: string
  organizationType: OrganizationType
}

export type AuthResponse = {
  accessToken: string
  user: AuthUser
}

export type RegisterResponse = AuthResponse & {
  message: string
}
