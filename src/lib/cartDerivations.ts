import type { CartLineItem, ImageRef } from '@/api/types';
import type { GuestCartItem } from '@/store/cartStore';

export interface CartRowAddon {
  id: string;
  name: string | null;
  price: number | null;
  unavailable: boolean;
}

export interface CartRowItem {
  id: string;
  name: string;
  image: ImageRef | null;
  price: number;
  quantity: number;
  durationMins?: number | null;
  unavailable: boolean;
  addons: CartRowAddon[];
}

/** Guest items were just added from a live catalog view, so they're never flagged unavailable — that's a server-side freshness check that only exists once merged (see cartStore.ts's mergeGuestCartIntoServer). */
export function normalizeGuestItem(item: GuestCartItem): CartRowItem {
  return {
    id: item.localId,
    name: item.name,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    durationMins: item.durationMins,
    unavailable: false,
    addons: item.selectedAddons.map((a) => ({ id: a.id, name: a.name, price: a.price, unavailable: false })),
  };
}

export function normalizeServerItem(item: CartLineItem): CartRowItem {
  return {
    id: item._id,
    name: item.name ?? 'Unavailable service',
    image: item.image,
    price: item.price ?? 0,
    quantity: item.quantity,
    durationMins: item.durationMins,
    unavailable: item.unavailable,
    addons: (item.selectedAddons ?? []).map((a) => ({ id: a._id, name: a.name, price: a.price, unavailable: a.unavailable })),
  };
}

export function cartRowTotal(item: CartRowItem): number {
  const addonsTotal = item.addons.reduce((sum, a) => sum + (a.price ?? 0), 0);
  return (item.price + addonsTotal) * item.quantity;
}

export function cartSubtotal(items: CartRowItem[]): number {
  return items.reduce((sum, item) => sum + cartRowTotal(item), 0);
}
