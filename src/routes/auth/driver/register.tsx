import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { FieldPath } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'

import AuthLayout from '#/components/auth/AuthLayout'
import FileUploadField from '#/components/auth/FileUploadField'
import FormNotice from '#/components/auth/FormNotice'
import { PasswordInput } from '#/components/auth/PasswordInput'
import {
  ACCEPTED_DOCUMENT_TYPES,
  MAX_DOCUMENT_SIZE,
  driverRegisterSchema,
} from '#/components/auth/schemas'
import type { DriverRegisterValues } from '#/components/auth/schemas'
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
import { api } from '#/lib/api/client'

export const Route = createFileRoute('/auth/driver/register')({
  component: DriverRegister,
})

const stepFields: Array<Array<FieldPath<DriverRegisterValues>>> = [
  ['name', 'email', 'password', 'confirmPassword'],
  [
    'vehicleMake',
    'vehicleModel',
    'vehicleYear',
    'vehicleCapacity',
    'vehiclePlate',
    'vehicleColor',
    'vehicleType',
  ],
  ['licenseFile', 'registrationFile'],
]

function DriverRegister() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const registerMutation = useMutation({
    mutationFn: (values: DriverRegisterValues) =>
      api('/users/register/driver', {
        method: 'POST',
        body: {
          name: values.name,
          email: values.email,
          passwordHash: values.password,
          licenseNumber: values.vehiclePlate,
          vehicleDetails: `${values.vehicleMake} ${values.vehicleModel} ${values.vehicleYear}`,
        },
      }),
    onSuccess: () => {
      toast.success('Registration submitted! Awaiting document verification.')
      void navigate({ to: '/dashboard/driver' })
    },
  })
  const form = useForm<DriverRegisterValues>({
    resolver: zodResolver(driverRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: 2020,
      vehicleCapacity: 4,
      vehiclePlate: '',
      vehicleColor: '',
      vehicleType: '',
      licenseFile: null,
      registrationFile: null,
    },
  })

  const onSubmit = (values: DriverRegisterValues) => {
    registerMutation.mutate(values)
  }

  const handleNextStep = async () => {
    const isValid = await form.trigger(stepFields[step])
    if (isValid) {
      setStep((current) => Math.min(current + 1, stepFields.length - 1))
    }
  }

  const handlePreviousStep = () => {
    setStep((current) => Math.max(current - 1, 0))
  }

  const isFinalStep = step === stepFields.length - 1

  return (
    <AuthLayout
      kicker="Driver"
      title="Register as a driver"
      description="Share your vehicle details and upload verification documents."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>
              Step {step + 1} of {stepFields.length}
            </span>
            <span>
              {step === 0
                ? 'Account details'
                : step === 1
                ? 'Vehicle details'
                : 'Verification documents'}
            </span>
          </div>

          {step === 0 ? (
            <div className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
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
                      <Input autoComplete="email" {...field} />
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
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="vehicleMake"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input placeholder="Toyota" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="RAV4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passenger capacity</FormLabel>
                    <FormControl>
                      <Input type="number" inputMode="numeric" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehiclePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License plate</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input placeholder="Silver" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Vehicle type</FormLabel>
                    <FormControl>
                      <Input placeholder="SUV, Sedan, Van" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <FileUploadField
                control={form.control}
                name="licenseFile"
                label="Driver license"
                description={`PDF, JPG, or PNG. Max size ${Math.round(
                  MAX_DOCUMENT_SIZE / 1024 / 1024
                )}MB.`}
                accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
              />
              <FileUploadField
                control={form.control}
                name="registrationFile"
                label="Vehicle registration"
                description={`PDF, JPG, or PNG. Max size ${Math.round(
                  MAX_DOCUMENT_SIZE / 1024 / 1024
                )}MB.`}
                accept={ACCEPTED_DOCUMENT_TYPES.join(',')}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={step === 0}
              className="sm:w-40"
            >
              Back
            </Button>
            {isFinalStep ? (
              <Button
                type="submit"
                className="sm:w-40"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? 'Submitting...'
                  : 'Submit registration'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                className="sm:w-40"
              >
                Continue
              </Button>
            )}
          </div>
        </form>
      </Form>

      {registerMutation.isError ? (
        <div className="mt-6">
          <FormNotice
            variant="warning"
            title="Registration failed"
            description={
              registerMutation.error instanceof Error
                ? registerMutation.error.message
                : 'Unable to submit registration right now.'
            }
          />
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between text-sm text-text-secondary">
        <span>Already registered?</span>
        <Link to="/auth/driver/login" className="text-accent-teal hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}
