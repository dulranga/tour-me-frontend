import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { verifyAuth } from '#/lib/auth'

export const Route = createFileRoute('/dashboard')({

  beforeLoad: async () => {
    // Verify authentication via /api/auth/me
    const user = await verifyAuth() 
    

    // If not authenticated, redirect to home
    if (!user) {
      throw redirect({
        to: '/auth/tourist/login',
      })
    }

    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return <Outlet />
}
