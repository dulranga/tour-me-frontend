import { createFileRoute, Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

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
import { loginSchema } from '#/components/auth/schemas'
import type { LoginValues } from '#/components/auth/schemas'

export const Route = createFileRoute('/auth/driver/login')({
  component: DriverLogin,
})

function DriverLogin() {
  const [isSuccess, setIsSuccess] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginValues) => {
    void values
    setIsSuccess(true)
  }

  return (
    <AuthLayout
      kicker="Driver"
      title="Driver sign in"
      description="Access your bids, trips, and passenger updates."
    >
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
                    placeholder="driver@tourme.com"
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
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Form>
      {isSuccess ? (
        <div className="mt-6">
          <FormNotice
            variant="success"
            title="Signed in"
            description="Your driver tools are ready on the home page."
          />
        </div>
      ) : null}
      <div className="mt-6 space-y-3">
        <FormNotice
          title="Approval status"
          description="Driver accounts require document verification. You will receive an email once approved."
        />
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span>New driver?</span>
          <Link
            to="/auth/driver/register"
            className="text-accent-teal hover:underline"
          >
            Start driver registration
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
