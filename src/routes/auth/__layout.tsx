 
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/__layout')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Outlet />
    </div>
  )
}
