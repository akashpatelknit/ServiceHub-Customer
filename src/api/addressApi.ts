import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Address, AddressPayload } from './types';

// Customer-scoped address routes (src/features/customer/routes/address.routes.js) —
// preferred over the generic /addresses routes since only this set exposes list + default.
const BASE = '/users/me/addresses';

export const addressApi = {
  getAddresses: () => apiGet<Address[]>(BASE),

  addAddress: (payload: AddressPayload) => apiPost<Address>(BASE, payload),

  updateAddress: (addressId: string, payload: Partial<AddressPayload>) => apiPatch<Address>(`${BASE}/${addressId}`, payload),

  deleteAddress: (addressId: string) => apiDelete<void>(`${BASE}/${addressId}`),

  setDefaultAddress: (addressId: string) => apiPatch<Address>(`${BASE}/${addressId}/default`),
};
