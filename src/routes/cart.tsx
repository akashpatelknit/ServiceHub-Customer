import { useMemo } from 'react';
import { createRoute } from '@tanstack/react-router';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { Skeleton } from '@/components/ui/skeleton';
import { useCheckoutGate } from '@/hooks/useAuthGuard';
import { cartSubtotal, normalizeGuestItem, normalizeServerItem } from '@/lib/cartDerivations';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/queries/useCartQueries';
import { Route as RootRoute } from './__root';

function CartPage() {
  const cart = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const goToCheckout = useCheckoutGate();

  const rows = useMemo(
    () => (cart.isGuest ? cart.items.map(normalizeGuestItem) : cart.items.map(normalizeServerItem)),
    [cart.isGuest, cart.items],
  );

  const subtotal = cartSubtotal(rows);
  const hasUnavailableItems = rows.some((row) => row.unavailable);

  if (cart.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Skeleton className="h-8 w-40" />
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-card" />
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 pb-28 lg:pb-6">
      <h1 className="text-2xl font-semibold text-ink-primary">Your cart</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-card border border-border bg-card px-4">
          {rows.map((row) => (
            <CartItemRow
              key={row.id}
              item={row}
              isUpdating={updateItem.isPending}
              onQuantityChange={(quantity) => updateItem.mutate({ id: row.id, quantity })}
              onRemove={() => removeItem.mutate(row.id)}
            />
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-20">
            <CartSummary itemCount={cart.itemCount} subtotal={subtotal} hasUnavailableItems={hasUnavailableItems} onCheckout={goToCheckout} />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <CartSummary
          variant="bar"
          itemCount={cart.itemCount}
          subtotal={subtotal}
          hasUnavailableItems={hasUnavailableItems}
          onCheckout={goToCheckout}
        />
      </div>
    </div>
  );
}

export const Route = createRoute({
  getParentRoute: () => RootRoute,
  path: '/cart',
  component: CartPage,
});
