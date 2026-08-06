import { apiGet, apiPatch, apiPost } from './client';
import type { AuthTokens, CustomerProfile, LoginPayload, ResetPasswordPayload, SignupPayload } from './types';

const BASE = '/auth/user';

export const authApi = {
  signup: (payload: SignupPayload) => apiPost<AuthTokens>(`${BASE}/signup`, { provider: 'email', ...payload }),

  login: (payload: LoginPayload) => apiPost<AuthTokens>(`${BASE}/login`, { provider: 'email', ...payload }),

  refresh: () => apiPost<AuthTokens>(`${BASE}/refresh`),

  me: () => apiGet<CustomerProfile>(`${BASE}/me`),

  logout: () => apiPost<void>(`${BASE}/logout`),

  forgotPassword: (email: string) => apiPost<void>(`${BASE}/forgot-password`, { email }),

  resetPassword: (payload: ResetPasswordPayload) => apiPost<void>(`${BASE}/reset-password`, payload),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiPatch<void>(`${BASE}/change-password`, { oldPassword, newPassword }),
};
