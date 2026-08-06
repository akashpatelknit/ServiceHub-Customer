import { apiPost } from './client';
import type { VendorLeadPayload } from './types';

export const vendorLeadApi = {
  submit: (payload: VendorLeadPayload) => apiPost<{ _id: string }>('/vendor-leads', payload),
};
