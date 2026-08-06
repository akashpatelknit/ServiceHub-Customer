import { create } from 'zustand';
import type { CustomerProfile } from '@/api/types';

interface AuthState {
  accessToken: string | null;
  user: CustomerProfile | null;
  /** True once the boot-time session check (GET /auth/user/me) has settled — gates rendering auth-dependent UI to avoid a logged-out flash. */
  isInitialized: boolean;
  setSession: (accessToken: string, user: CustomerProfile) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: CustomerProfile | null) => void;
  setInitialized: () => void;
  clearSession: () => void;
}

/**
 * Access token lives in memory only (never persisted) — the backend issues a
 * short-lived access token (15min) plus a 7-day httpOnly refresh cookie. On reload,
 * the token is gone from memory but the refresh cookie survives; the first
 * authenticated request 401s, the client.ts interceptor silently refreshes, and the
 * session is transparently restored. See queries/useAuthQueries.ts `useMe`.
 */
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,
  setSession: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  setInitialized: () => set({ isInitialized: true }),
  clearSession: () => set({ accessToken: null, user: null }),
}));
