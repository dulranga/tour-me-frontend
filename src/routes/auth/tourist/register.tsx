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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { registerSchema } from '#/components/auth/schemas'
import type { RegisterValues } from '#/components/auth/schemas'

export const Route = createFileRoute('/auth/tourist/register')({
  component: TouristRegister,
})

function TouristRegister() {
  const [isSuccess, setIsSuccess] = useState(false)
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: RegisterValues) => {
    void values
    setIsSuccess(true)
  }

  return (
    <AuthLayout
      kicker="Tourist"
      title="Create your tourist account"
      description="Plan trips, compare driver bids, and share feedback."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input autoComplete="name" placeholder="Jordan Lee" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormDescription>
                  Use at least 8 characters with a mix of letters and numbers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create account
          </Button>
        </form>
      </Form>
      {isSuccess ? (
        <div className="mt-6">
          <FormNotice
            variant="success"
            title="Account created"
            description="You are signed in. Head to the home page to get started."
          />
        </div>
      ) : null}
      <div className="mt-6 flex items-center justify-between text-sm text-text-secondary">
        <span>Already have an account?</span>
        <Link
          to="/auth/tourist/login"
          className="text-accent-teal hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
