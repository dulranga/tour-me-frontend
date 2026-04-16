import { api } from './api/client'

export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  TOURIST = 'TOURIST',
}

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
}

/**
 * Verify authentication by calling /api/auth/me
 * Cookies are automatically sent via credentials: 'include'
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  try {
    const user = await api<AuthUser>('/auth/me')
    console.log(user)

    return user
  } catch {
    return null
  }
}

/**
 * Logout by calling the logout endpoint
 * Server will clear the auth cookie
 */
export async function logout(): Promise<void> {
  try {
    await api('/auth/logout', {
      method: 'POST',
    })
  } catch {
    // Logout endpoint may fail, but we still clear local state
  }
}
