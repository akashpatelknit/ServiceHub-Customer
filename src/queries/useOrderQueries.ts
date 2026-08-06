import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';
import type { CheckoutPayload, ListOrdersParams } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => orderApi.checkout(payload),
    // checkout.service.js clears the cart server-side as part of the same atomic
    // transaction that creates the order — true regardless of whether the Razorpay
    // payment that follows ever completes.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() }),
  });
}

export function useOrders(filters?: ListOrdersParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => orderApi.getOrders(filters),
  });
}

/**
 * Payment confirmation happens asynchronously via a Razorpay webhook, not the
 * checkout response itself — an order can sit at paymentStatus 'pending' for a few
 * seconds after the Razorpay widget reports success. Polls until it resolves.
 */
export function useOrder(orderNumber: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderNumber),
    queryFn: () => orderApi.getOrder(orderNumber!),
    enabled: Boolean(orderNumber),
    refetchInterval: (query) => (query.state.data?.paymentStatus === 'pending' ? 2000 : false),
  });
}
