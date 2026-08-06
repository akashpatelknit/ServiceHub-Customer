import { z } from 'zod';

/** Mirrors service-hub-backend/src/features/vendor-leads/validators/vendorLead.validation.js exactly. */

const phone = z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const vendorLeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  phone,
  email: z.string().trim().toLowerCase().email('Invalid email format'),
  city: z.string().trim().min(1, 'City is required').max(100),
  category: z.string().trim().min(1, 'Category is required').max(100),
});

export type VendorLeadFormValues = z.infer<typeof vendorLeadSchema>;
