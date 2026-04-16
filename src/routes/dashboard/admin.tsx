import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { verifyAuth, UserRole } from '#/lib/auth'

export const Route = createFileRoute('/dashboard/admin')({
  beforeLoad: async () => {
    // Verify authentication via /api/auth/me
    const user = await verifyAuth()

    // If not authenticated, redirect to admin login
    if (!user) {
      throw redirect({
        to: '/auth/admin/login',
      })
    }

    // Verify user is an admin
    if (user.role !== UserRole.ADMIN) {
      // User is authenticated but not an admin - deny access
      throw redirect({
        to: '/',
      })
    }

    return { user }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
