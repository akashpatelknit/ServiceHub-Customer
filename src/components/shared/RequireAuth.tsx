import type { ReactNode } from 'react';
import { useRequireAuth } from '@/hooks/useAuthGuard';

interface RequireAuthProps {
  /** Path to return to after login — passed straight to useRequireAuth/the login route's returnTo search param. */
  returnTo: string;
  children: ReactNode;
}

/** Thin wrapper around the existing useRequireAuth hook (see checkout.tsx for the original inline pattern) so gated pages don't each repeat the isChecking/isAuthenticated boilerplate. */
export function RequireAuth({ returnTo, children }: RequireAuthProps) {
  const { isChecking, isAuthenticated } = useRequireAuth(returnTo);

  if (isChecking || !isAuthenticated) {
    return <div className="mx-auto max-w-5xl px-4 py-12 text-ink-secondary">Checking your session…</div>;
  }

  return <>{children}</>;
}
