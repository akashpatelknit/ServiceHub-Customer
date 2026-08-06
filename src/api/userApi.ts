import { apiPatch } from './client';
import type { CustomerProfile, UpdateProfilePayload } from './types';

const BASE = '/users/me';

export const userApi = {
  updateProfile: (payload: UpdateProfilePayload) => apiPatch<CustomerProfile>(BASE, payload),
};
