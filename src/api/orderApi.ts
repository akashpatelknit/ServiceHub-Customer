import { apiGet, apiPost } from './client';
import type { CheckoutPayload, CheckoutResult, CustomerOrder, ListOrdersParams, Paginated } from './types';

export const orderApi = {
  checkout: (payload: CheckoutPayload) => apiPost<CheckoutResult>('/checkout', payload),

  getOrders: (params?: ListOrdersParams) => apiGet<Paginated<CustomerOrder>>('/orders', { params }),

  getOrder: (orderNumber: string) => apiGet<CustomerOrder>(`/orders/${orderNumber}`),

  cancelOrder: (orderNumber: string) => apiPost<CustomerOrder>(`/orders/${orderNumber}/cancel`),
};
