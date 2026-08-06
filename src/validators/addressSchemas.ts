import { z } from 'zod';

/** Mirrors service-hub-backend/src/features/customer/validators/address.validation.js exactly. */

export const addressSchema = z.object({
  street: z.string().trim().min(1, 'Street is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  label: z.enum(['Home', 'Work', 'Other']).optional(),
  landmark: z.string().trim().optional(),
  country: z.string().trim().optional(),
  geolocation: z.object({ lat: z.number(), lng: z.number() }).optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
