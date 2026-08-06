import { Link, useNavigate } from '@tanstack/react-router';
import { LogOut, ShoppingCart, User, UserCircle } from 'lucide-react';
import { LocationSelector } from '@/components/layout/LocationSelector';
import { Logo } from '@/components/layout/Logo';
import { MobileSearchOverlay } from '@/components/layout/MobileSearchOverlay';
import { SearchBar } from '@/components/layout/SearchBar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLogout } from '@/queries/useAuthQueries';
import { useCart } from '@/queries/useCartQueries';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cart = useCart();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => void navigate({ to: '/' }),
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center">
            <Logo />
          </Link>

          <LocationSelector />

          <div className="hidden flex-1 sm:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <div className="sm:hidden">
              <MobileSearchOverlay />
            </div>

            <Link
              to="/cart"
              className="relative flex size-10 items-center justify-center rounded-full text-ink-primary hover:bg-surface-hover"
              aria-label="Cart"
            >
              <ShoppingCart className="size-5" />
              {cart.itemCount > 0 && (
                <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cart.itemCount > 9 ? '9+' : cart.itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full bg-primary-subtle text-sm font-semibold text-primary-subtle-text hover:opacity-90"
                    aria-label="Account menu"
                  >
                    {user.firstName?.charAt(0)?.toUpperCase() ?? <User className="size-5" />}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <div className="border-b border-border px-2 py-2 text-sm">
                    <p className="font-medium text-ink-primary">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-ink-secondary">{user.email}</p>
                  </div>
                  <Link
                    to="/account"
                    className="mt-1 flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-ink-primary hover:bg-surface-hover"
                  >
                    <UserCircle className="size-4" />
                    My account
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-danger hover:bg-danger-subtle"
                  >
                    <LogOut className="size-4" />
                    Log out
                  </button>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-pill border border-line px-3 py-2 text-sm font-medium text-ink-primary hover:bg-surface-hover"
              >
                <User className="size-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
