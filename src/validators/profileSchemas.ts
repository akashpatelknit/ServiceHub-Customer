import { z } from 'zod';

/** Mirrors service-hub-backend/src/features/customer/validators/profile.validation.js exactly. */

const name = z.string().trim().min(1).max(50);

export const profileSchema = z.object({
  firstName: name,
  lastName: name.optional().or(z.literal('')),
  email: z.string().trim().toLowerCase().email('Invalid email format'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must contain at least one letter and one number');

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: password,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.oldPassword, {
    message: 'New password must differ from your current password',
    path: ['newPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
