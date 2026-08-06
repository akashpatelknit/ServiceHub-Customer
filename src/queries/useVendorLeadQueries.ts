import { useMutation } from '@tanstack/react-query';
import { vendorLeadApi } from '@/api/vendorLeadApi';
import type { VendorLeadPayload } from '@/api/types';

export function useSubmitVendorLead() {
  return useMutation({
    mutationFn: (payload: VendorLeadPayload) => vendorLeadApi.submit(payload),
  });
}
