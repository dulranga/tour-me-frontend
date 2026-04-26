import React, { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { verifyAuth } from './auth'
import type { AuthUser } from './auth'

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const USER_QUERY_KEY = ['auth', 'user']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const queryClient = useQueryClient()

  const { isLoading, refetch } = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: verifyAuth,
    staleTime: Infinity,
    retry: 1,
  })

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.query.queryKey === USER_QUERY_KEY && event.type === 'updated') {
        setUser(event.query.state.data || null)
      }
    })

    return () => unsubscribe()
  }, [queryClient])

  const refetchUser = async () => {
    await refetch()
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, refetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
