import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { AddCartItemPayload, CartDocument, PopulatedCart, UpdateCartItemPayload } from './types';

// All /cart routes require an authenticated User (src/features/cart/routes/cart.routes.js).
// There is no server-side guest cart — guests are held client-side in cartStore.ts and
// merged into the server cart item-by-item via addItem() right after login.
const BASE = '/cart';

export const cartApi = {
  getCart: () => apiGet<PopulatedCart>(BASE),

  addItem: (payload: AddCartItemPayload) => apiPost<CartDocument>(`${BASE}/items`, payload),

  updateItem: (itemId: string, payload: UpdateCartItemPayload) => apiPatch<CartDocument>(`${BASE}/items/${itemId}`, payload),

  removeItem: (itemId: string) => apiDelete<CartDocument>(`${BASE}/items/${itemId}`),

  clearCart: () => apiDelete<CartDocument>(BASE),
};
