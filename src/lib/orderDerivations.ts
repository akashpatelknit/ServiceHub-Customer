import type { CustomerOrder, ProductOrderStatus, ServiceOrderStatus } from '@/api/types';

/** The linear "happy path" lifecycle for each order type — cancelled/returned are terminal side-states, not steps on this path. */
export const SERVICE_ORDER_STEPS: ServiceOrderStatus[] = ['pending', 'confirmed', 'assigned', 'in-progress', 'completed'];
export const PRODUCT_ORDER_STEPS: ProductOrderStatus[] = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

const STEP_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  'in-progress': 'In Progress',
  completed: 'Completed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export function stepLabel(step: string) {
  return STEP_LABELS[step] ?? step;
}

/**
 * No `cancellable`/`allowedNextStatuses` field exists on the order response — this
 * duplicates the backend's hardcoded transition table exactly (src/features/order-core/
 * utils/assertValidTransition.js + each feature's orderStatus.constants.js). If the
 * backend rule ever changes, this will silently drift — flagged in the account-section
 * gap report.
 */
const CANCELLABLE_SERVICE_STATUSES: ServiceOrderStatus[] = ['pending', 'confirmed', 'assigned'];
const CANCELLABLE_PRODUCT_STATUSES: ProductOrderStatus[] = ['pending', 'confirmed'];

export function isOrderCancellable(order: CustomerOrder): boolean {
  if (order.orderType === 'service') {
    return CANCELLABLE_SERVICE_STATUSES.includes(order.status);
  }
  return CANCELLABLE_PRODUCT_STATUSES.includes(order.status);
}

/** "First item name + N more" summary for order-list cards. */
export function orderItemSummary(order: CustomerOrder): string {
  const names = order.orderType === 'service' ? order.items.map((i) => i.serviceNameSnapshot) : order.items.map((i) => i.productNameSnapshot);
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  return `${names[0]} +${names.length - 1} more`;
}
