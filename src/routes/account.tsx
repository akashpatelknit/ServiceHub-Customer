import { createRoute, useNavigate } from '@tanstack/react-router';
import { LogOut, MapPin, Package, Settings, User } from 'lucide-react';
import { AccountNavAction, AccountNavLink } from '@/components/account/AccountNavRow';
import { RequireAuth } from '@/components/shared/RequireAuth';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { useLogout } from '@/queries/useAuthQueries';
import { useAuthStore } from '@/store/authStore';
import { Route as RootRoute } from './__root';

function AccountHomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, { onSuccess: () => void navigate({ to: '/' }) });
  };

  return (
    <RequireAuth returnTo="/account">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-semibold text-ink-primary">My account</h1>

        <div className="mt-4 flex items-center gap-3 rounded-card border border-border bg-card p-4">
          <ImageWithFallback src={user?.avatar?.url} alt="" className="size-14 shrink-0 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-primary">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-ink-secondary">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <AccountNavLink to="/account/profile" icon={User} label="Profile" />
          <AccountNavLink to="/account/addresses" icon={MapPin} label="Addresses" />
          <AccountNavLink to="/account/orders" icon={Package} label="Order History" />
          <AccountNavLink to="/account/settings" icon={Settings} label="Settings" />
          <AccountNavAction
            icon={LogOut}
            label={logout.isPending ? 'Logging out…' : 'Log out'}
            danger
            showChevron={false}
            onClick={handleLogout}
            disabled={logout.isPending}
          />
        </div>
      </div>
    </RequireAuth>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/account',
  component: AccountHomePage,
});
