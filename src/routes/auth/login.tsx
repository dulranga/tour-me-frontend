import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import AuthLayout from '#/components/auth/AuthLayout'
import FormNotice from '#/components/auth/FormNotice'
import { PasswordInput } from '#/components/auth/PasswordInput'
import { Button } from '#/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { api } from '#/lib/api/client'
import { loginSchema } from '#/components/auth/schemas'
import { useAuth } from '#/lib/AuthContext'
import { UserRole } from '#/lib/auth'
import type { LoginValues } from '#/components/auth/schemas'

export const Route = createFileRoute('/auth/login')({
  component: Login,
})

function Login() {
  const navigate = useNavigate()
  const { refetchUser } = useAuth()

  const getDashboardPath = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return '/dashboard/administrator'
      case UserRole.DRIVER:
        return '/dashboard/driver'
      case UserRole.TOURIST:
        return '/dashboard/tourist'
      default:
        return '/dashboard'
    }
  }

  const loginMutation = useMutation({
    mutationFn: (values: LoginValues) =>
      api<{ role: UserRole }>('/auth/login', {
        method: 'POST',
        body: {
          email: values.email,
          password: values.password,
        },
      }),
    onSuccess: async (data) => {
      toast.success('Signed in successfully')
      await refetchUser()
      const dashboardPath = getDashboardPath(data.role)
      void navigate({ to: dashboardPath })
    },
  })

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginValues) => {
    loginMutation.mutate(values)
  }

  return (
    <AuthLayout kicker="TourMe" title="Sign in" description="Welcome back">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </Form>

      {loginMutation.isError ? (
        <div className="mt-6">
          <FormNotice
            variant="warning"
            title="Sign in failed"
            description={
              loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'Unable to sign in right now.'
            }
          />
        </div>
      ) : null}
    </AuthLayout>
  )
}
