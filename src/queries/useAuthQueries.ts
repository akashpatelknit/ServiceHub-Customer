import { useEffect } from 'react';
import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/api/authApi';
import type { LoginPayload, ResetPasswordPayload, SignupPayload } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

/**
 * Boot-time session check. No access token survives a page reload (see
 * authStore.ts), so this is how a returning logged-in user gets their session back:
 * GET /auth/user/me runs with only the httpOnly refresh cookie available, 401s,
 * client.ts's interceptor transparently refreshes, and this retries and succeeds.
 */
export function useMe() {
  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    retry: false,
  });

  const setUser = useAuthStore((state) => state.setUser);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    if (query.isSuccess) {
      setUser(query.data);
      setInitialized();
    } else if (query.isError) {
      setUser(null);
      setInitialized();
    }
  }, [query.isSuccess, query.isError, query.data, setUser, setInitialized]);

  return query;
}

/**
 * Runs after both login and signup: stores the session, fetches the profile (neither endpoint
 * returns it), and merges any guest cart into the now-authenticated server cart.
 *
 * Cancels the boot-time `useMe()` query first: if that query is still in flight (e.g. its first
 * request paid a cold-start penalty) it would otherwise settle with `isError` *after* this
 * function sets the real session, and `useMe()`'s effect would clobber it back to `null`.
 */
async function establishSession(tokens: { accessToken: string }, queryClient: QueryClient) {
  await queryClient.cancelQueries({ queryKey: queryKeys.auth.me() });

  useAuthStore.getState().setAccessToken(tokens.accessToken);

  const user = await queryClient.fetchQuery({ queryKey: queryKeys.auth.me(), queryFn: authApi.me });
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setInitialized();

  const { mergedCount, failedItems } = await useCartStore.getState().mergeGuestCartIntoServer();
  if (mergedCount > 0) {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
  }
  if (failedItems.length > 0) {
    toast.warning(`${failedItems.length} item(s) from your cart could no longer be added — they may no longer be available.`);
  }
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (tokens) => establishSession(tokens, queryClient),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: (tokens) => establishSession(tokens, queryClient),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}

/** PATCH /auth/user/change-password clears cookies server-side and requires re-login — mirrors useLogout's local cleanup. */
export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      authApi.changePassword(oldPassword, newPassword),
    onSuccess: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) });
}

export function useResetPassword() {
  return useMutation({ mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload) });
}
