import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

/**
 * Gates a page's content on being logged in. Waits for `isInitialized` (the
 * boot-time GET /auth/user/me settling — see useAuthQueries.ts's useMe) before
 * redirecting, so a logged-in user whose session hasn't finished restoring yet
 * doesn't get bounced to /login by mistake.
 */
export function useRequireAuth(returnTo: string) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && !user) {
      navigate({ to: '/login', search: { returnTo } });
    }
  }, [isInitialized, user, navigate, returnTo]);

  return { isChecking: !isInitialized, isAuthenticated: Boolean(user) };
}

/** Used by the Cart page's "Proceed to checkout" button — the gate itself, not a route guard. */
export function useCheckoutGate() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return () => {
    if (user) {
      navigate({ to: '/checkout' });
    } else {
      navigate({ to: '/login', search: { returnTo: '/checkout' } });
    }
  };
}
