import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { verifyAuth } from '#/lib/auth'

export const Route = createFileRoute('/dashboard/driver')({
  beforeLoad: async () => {
    // Verify authentication via /api/auth/me
    const user = await verifyAuth()

    // If not authenticated, redirect to driver login
    if (!user) {
      throw redirect({
        to: '/auth/driver/login',
      })
    }

    // Verify user is a driver
    if (user.role !== 'driver') {
      // User is authenticated but not a driver - deny access
      throw redirect({
        to: '/',
      })
    }

    return { user }
  },
  component: DriverLayout,
})

function DriverLayout() {
  return <Outlet />
}
