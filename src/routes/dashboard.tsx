import { verifyAuth } from '#/lib/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  ssr: false, // Disable SSR for this route
  beforeLoad: async (req) => {
    // Verify authentication via /api/auth/me
    const user = await verifyAuth()
    const role = user?.role.toLowerCase() as 'tourist' | 'driver' | 'admin'

    // If not authenticated, redirect to tourist login
    if (!user) {
      throw redirect({
        to: `/auth/login`,
      })
    }

    if (req.location.pathname.includes(role)) {
      redirect({
        to: `/dashboard/${role}`,
      })
    } else {
      throw redirect({
        to: `/dashboard/${role}`,
      })
    }

    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return <Outlet />
}
