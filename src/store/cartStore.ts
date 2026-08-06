import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/api/cartApi';
import type { CartItemType, ImageRef } from '@/api/types';

export interface GuestCartAddon {
  id: string;
  name: string;
  price: number;
}

export interface GuestCartItem {
  localId: string;
  itemType: CartItemType;
  refId: string;
  quantity: number;
  selectedAddons: GuestCartAddon[];
  /** Snapshotted at add-time so the guest cart page can render without extra fetches — re-validated for real at checkout (auth-gated, server cart takes over by then). */
  name: string;
  price: number;
  image: ImageRef | null;
  durationMins?: number;
}

interface CartState {
  guestItems: GuestCartItem[];
  addGuestItem: (item: Omit<GuestCartItem, 'localId'>) => void;
  updateGuestItem: (localId: string, patch: { quantity?: number }) => void;
  removeGuestItem: (localId: string) => void;
  clearGuestCart: () => void;
  /**
   * Pushes every guest item to the server cart (one POST /cart/items per line). Call
   * once, right after login/signup succeeds. Uses allSettled so one stale item (e.g.
   * a service that went inactive while browsing as a guest) doesn't block the rest —
   * only successfully-merged items are cleared; failures stay in the guest buffer and
   * are returned so the caller can surface them (e.g. a toast).
   */
  mergeGuestCartIntoServer: () => Promise<{ mergedCount: number; failedItems: GuestCartItem[] }>;
}

const addonsKey = (addons: GuestCartAddon[]) => addons.map((a) => a.id).sort().join(',');

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestItems: [],

      addGuestItem: (item) =>
        set((state) => {
          const key = addonsKey(item.selectedAddons);
          const existing = state.guestItems.find(
            (i) => i.itemType === item.itemType && i.refId === item.refId && addonsKey(i.selectedAddons) === key,
          );

          if (existing) {
            return {
              guestItems: state.guestItems.map((i) =>
                i.localId === existing.localId ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }

          const localId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
          return { guestItems: [...state.guestItems, { ...item, localId }] };
        }),

      updateGuestItem: (localId, patch) =>
        set((state) => ({
          guestItems: state.guestItems.map((i) => (i.localId === localId ? { ...i, ...patch } : i)),
        })),

      removeGuestItem: (localId) =>
        set((state) => ({ guestItems: state.guestItems.filter((i) => i.localId !== localId) })),

      clearGuestCart: () => set({ guestItems: [] }),

      mergeGuestCartIntoServer: async () => {
        const items = get().guestItems;
        if (!items.length) return { mergedCount: 0, failedItems: [] };

        const results = await Promise.allSettled(
          items.map((item) =>
            cartApi.addItem({
              itemType: item.itemType,
              refId: item.refId,
              quantity: item.quantity,
              selectedAddons: item.selectedAddons.map((a) => a.id),
            }),
          ),
        );

        const failedItems = items.filter((_, index) => results[index]?.status === 'rejected');
        set({ guestItems: failedItems });

        return { mergedCount: items.length - failedItems.length, failedItems };
      },
    }),
    {
      name: 'service-hub-customer:guest-cart',
      partialize: (state) => ({ guestItems: state.guestItems }),
    },
  ),
);
