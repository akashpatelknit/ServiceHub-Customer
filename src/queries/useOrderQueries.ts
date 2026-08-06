import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orderApi';
import type { CheckoutPayload, ListOrdersParams } from '@/api/types';
import { queryKeys } from '@/lib/queryKeys';

const ORDER_HISTORY_PAGE_SIZE = 10;

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

/** Order History page's "Load more" list — one page-accumulating query per type filter. */
export function useInfiniteOrders(type?: ListOrdersParams['type']) {
  const filters = { type, limit: ORDER_HISTORY_PAGE_SIZE };
  return useInfiniteQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: ({ pageParam }) => orderApi.getOrders({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page * lastPage.limit < lastPage.total ? lastPage.page + 1 : undefined),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) => orderApi.cancelOrder(orderNumber),
    onSuccess: (_data, orderNumber) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderNumber) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
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
