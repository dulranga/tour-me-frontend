import { z } from 'zod'

const emailSchema = z
  .string()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.')

const nameSchema = z.string().min(2, 'Name is required.')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

const confirmPasswordSchema = z.string().min(1, 'Please confirm your password.')

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024
export const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
]

const optionalDocumentSchema = z
  .custom<File | null | undefined>()
  .nullable()
  .optional()
  .refine(
    (file) => file === null || file === undefined || file instanceof File,
    'Document must be a file.',
  )
  .refine(
    (file) =>
      file === null || file === undefined || file.size <= MAX_DOCUMENT_SIZE,
    'File must be 5MB or less.',
  )
  .refine(
    (file) =>
      file === null ||
      file === undefined ||
      ACCEPTED_DOCUMENT_TYPES.includes(file.type),
    'File must be a PDF or JPG/PNG image.',
  )

const currentYear = new Date().getFullYear()

export const driverRegisterSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    vehicleMake: z.string().min(1, 'Vehicle make is required.'),
    vehicleModel: z.string().min(1, 'Vehicle model is required.'),
    vehicleYear: z.coerce
      .number()
      .int('Vehicle year must be a whole number.')
      .min(1980, 'Vehicle year must be 1980 or later.')
      .max(currentYear + 1, 'Vehicle year looks too new.'),
    vehicleCapacity: z.coerce
      .number()
      .int('Capacity must be a whole number.')
      .min(1, 'Capacity must be at least 1.'),
    vehiclePlate: z.string().min(1, 'License plate is required.'),
    vehicleColor: z.string().min(1, 'Vehicle color is required.'),
    vehicleType: z.string().min(1, 'Vehicle type is required.'),
    licenseFile: optionalDocumentSchema,
    registrationFile: optionalDocumentSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
export type DriverRegisterValues = z.infer<typeof driverRegisterSchema>
