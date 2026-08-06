import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';
import type { AddOn, Service } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const CART_KEY = queryKeys.cart.current();

/**
 * Unified read across both cart sources — guests never hit the server (no anonymous
 * cart endpoint exists), authenticated users' cart lives server-side. Consumers branch
 * on `isGuest` to render the right item shape (GuestCartItem vs. the server's
 * populated CartLineItem — see cartStore.ts / api/types.ts).
 */
export function useCart() {
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  const guestItems = useCartStore((state) => state.guestItems);

  const serverCart = useQuery({
    queryKey: CART_KEY,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  if (isAuthenticated) {
    const items = serverCart.data?.items ?? [];
    return {
      isGuest: false as const,
      isLoading: serverCart.isLoading,
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  return {
    isGuest: true as const,
    isLoading: false,
    items: guestItems,
    itemCount: guestItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}

interface AddToCartInput {
  service: Pick<Service, '_id' | 'name' | 'price' | 'images' | 'durationMins'>;
  quantity?: number;
  /** Full objects, not just IDs — the guest cart snapshots name/price for display since it has no server round-trip to re-resolve them from. */
  selectedAddons?: Pick<AddOn, '_id' | 'name' | 'price'>[];
}

/** Services only for now — Product catalog UI doesn't exist yet, matches backend's own itemType union. */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  const addGuestItem = useCartStore((state) => state.addGuestItem);

  return useMutation({
    mutationFn: async ({ service, quantity = 1, selectedAddons = [] }: AddToCartInput) => {
      if (isAuthenticated) {
        return cartApi.addItem({
          itemType: 'service',
          refId: service._id,
          quantity,
          selectedAddons: selectedAddons.map((a) => a._id),
        });
      }

      addGuestItem({
        itemType: 'service',
        refId: service._id,
        quantity,
        selectedAddons: selectedAddons.map((a) => ({ id: a._id, name: a.name, price: a.price })),
        name: service.name,
        price: service.price,
        image: service.images[0] ?? null,
        durationMins: service.durationMins,
      });
      return null;
    },
    onSuccess: () => {
      if (isAuthenticated) queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

/** Quantity only — add-on selection isn't editable after the fact from the cart row, only at add-time on the service detail page. */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  const updateGuestItem = useCartStore((state) => state.updateGuestItem);

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      if (isAuthenticated) {
        return cartApi.updateItem(id, { quantity });
      }
      updateGuestItem(id, { quantity });
      return null;
    },
    onSuccess: () => {
      if (isAuthenticated) queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  const removeGuestItem = useCartStore((state) => state.removeGuestItem);

  return useMutation({
    mutationFn: async (id: string) => {
      if (isAuthenticated) {
        return cartApi.removeItem(id);
      }
      removeGuestItem(id);
      return null;
    },
    onSuccess: () => {
      if (isAuthenticated) queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(useAuthStore((state) => state.user));
  const clearGuestCart = useCartStore((state) => state.clearGuestCart);

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        return cartApi.clearCart();
      }
      clearGuestCart();
      return null;
    },
    onSuccess: () => {
      if (isAuthenticated) queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
