import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { UserRole, verifyAuth } from '#/lib/auth'

export const Route = createFileRoute('/dashboard/tourist')({
  beforeLoad: async () => {
    // Verify authentication via /api/auth/me
    const user = await verifyAuth()

    // If not authenticated, redirect to tourist login
    if (!user) {
      throw redirect({
        to: '/auth/tourist/login',
      })
    }

    // Verify user is a tourist
    if (user.role !== UserRole.TOURIST) {
      // User is authenticated but not a tourist - deny access
      throw redirect({
        to: '/',
      })
    }

    return { user }
  },
  component: TouristLayout,
})

function TouristLayout() {
  return  <Outlet />
  
}
