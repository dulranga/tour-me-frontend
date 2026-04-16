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

export const Route = createFileRoute('/auth/admin/register')({
  component: AdminRegister,
})

function AdminRegister() {
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
      kicker="Administrator"
      title="Admin access request"
      description="Admin accounts are provisioned by the TourMe team."
    >
      <FormNotice
        variant="warning"
        title="Admin accounts require approval"
        description="Submit your details to request access. You will be contacted by email."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
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
            Request admin access
          </Button>
        </form>
      </Form>
      {isSuccess ? (
        <div className="mt-6">
          <FormNotice
            variant="success"
            title="Request sent"
            description="We will reach out once your admin account is ready."
          />
        </div>
      ) : null}
      <div className="mt-6 flex items-center justify-between text-sm text-text-secondary">
        <span>Already have admin access?</span>
        <Link to="/auth/admin/login" className="text-accent-teal hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
