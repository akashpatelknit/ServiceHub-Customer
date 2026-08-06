import { z } from 'zod';

/** Mirrors service-hub-backend/src/features/auth/validators/auth.validation.js exactly. */

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain at least one letter and one number');

const nameSchema = z.string().trim().min(1).max(50);

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema.optional(),
    email: z.string().trim().toLowerCase().email('Invalid email format'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email format'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
