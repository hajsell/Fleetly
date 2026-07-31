import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  RegisterResponse,
} from '../types/auth.types'
import { apiRequest } from './apiClient'

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function register(data: RegisterData): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: data,
  })
}
